import { from, Observable, BehaviorSubject, timer } from 'rxjs';
import { retryWhen, delayWhen } from 'rxjs/operators';
import { HubConnectionBuilder, HubConnection, HttpTransportType, HttpError } from '@aspnet/signalr';

export abstract class SignalRAbstractService<T extends SignalrMethods> {

  private connection: HubConnection;
  public connected = new BehaviorSubject<boolean>(false);

  protected abstract baseUrl: string;
  protected abstract url: string;
  protected abstract methods: T;
  protected abstract connectionTryDelay: number;
  protected transport?: HttpTransportType;

  constructor() {
  }

  protected start() {
    return new Observable((observer) => {
      if (!this.connected.getValue()) {
        this.init();
        from(this.connection.start()).subscribe(
          () => {
            this.connected.next(true);
            observer.next(true);
          },
          () => {
            this.connected.next(false);
            observer.error(false);
          },
          () => observer.complete()
        );
      } else {
        console.warn('already connected');
        observer.next(false);
        observer.complete();
      }
    }).pipe(
      retryWhen(errors => {
        return errors.pipe(delayWhen(val => timer(this.connectionTryDelay)));
      })
    );
  }

  protected stop() {
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    } else {
      console.warn('not connected yet');
    }
  }

  private init() {
    // https://docs.microsoft.com/en-us/aspnet/core/signalr/authn-and-authz?view=aspnetcore-2.1
    if (!this.connection) {
      this.connection = new HubConnectionBuilder()
        .withUrl(`${this.baseUrl}${this.url}`,
          this.transport ? { transport: this.transport } : {}
        )
        .build();
      this.registerMethods();
    }
  }

  private registerMethods() {
    this.connection.onclose((error) => this.onClose(error));
    for (const key in this.methods) {
      if (key) {
        this.connection.on(key, this.methods[key]);
      }
    }
  }

  private onClose(error: Error) {
    this.connected.next(false);
    // Will receive error if connection error but undefined if stop function is called
    console.log('onClose', error);
    if (error) {
      if (error instanceof HttpError || error.message.includes(' 1006 ')) {
        this.start().subscribe();
      }
    }
  }

  protected send(methodName: string, ...datas: any[]): Observable<any> {
    return from(this.connection.send(methodName, ...datas));
  }

}

export interface SignalrMethods {
  [key: string]: SignalrMethod;
}

export type SignalrMethod = (...args: any[]) => void;
