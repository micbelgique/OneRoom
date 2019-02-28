import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpTransportType } from '@aspnet/signalr';
import { SignalRCoreService } from './abstracts/signalr/signalr.core.service';
import { SignalrMethod, SignalrMethods } from './abstracts/signalr/signalr.abstract.service';

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

  protected url = '/LeaderBoardHub';
  protected transport = HttpTransportType.LongPolling;
  protected connectionTryDelay = 10000;

  protected methods: MonitoringMethods = {
    UpdateUsers: () => this._refreshUserList.emit(true)
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
