import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
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
  private _refreshUserList = new EventEmitter<boolean>();
  public refreshUserList  = this._refreshUserList.asObservable();

  // tslint:disable-next-line:variable-name
  private _refreshClientList = new EventEmitter<boolean>();
  public refreshClientList  = this._refreshClientList.asObservable();

  protected url = '/LeaderBoardHub';
  protected transport = HttpTransportType.LongPolling;
  protected connectionTryDelay = 10000;

  protected methods: MonitoringMethods = {
    UpdateUsers: () => this._refreshUserList.emit(true),
    UpdateClients: () => this._refreshClientList.emit(true)
  };

  constructor() {
    super();
  }

  public run(): Observable<any> {
    return this.start();
  }

  public stop(): void {
    this.stop();
}
}
