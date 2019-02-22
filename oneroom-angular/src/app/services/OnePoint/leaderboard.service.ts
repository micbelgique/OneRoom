import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { User } from './model/user';
import { SignalrMethod, SignalrMethods, SignalRCoreService } from './abstracts/signalr';
import { HttpTransportType } from '@aspnet/signalr';
import { switchMap } from 'rxjs/operators';

interface MonitoringMethods extends SignalrMethods {
  UpdateUsers: SignalrMethod;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService extends SignalRCoreService<MonitoringMethods> {

  // tslint:disable-next-line:variable-name
  private _userListReceiver = new Subject<User>();
  public userListReceiver = this._userListReceiver.asObservable();

  protected url = '/LeaderBoardHub';
  protected transport = HttpTransportType.LongPolling;
  protected connectionTryDelay = 10000;

  protected methods: MonitoringMethods = {
    UpdateUsers: (data) => this._userListReceiver.next(data)
  };

  constructor() {
    super();
  }

  public run(): Observable<User> {
    return this.start().pipe(
      switchMap(() => this.userListReceiver)
    );
}

  public close() {
    this.stop();
  }
}
