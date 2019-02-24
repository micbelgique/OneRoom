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

  private sub;

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

  public run(): void {
    this.sub = this.start().subscribe();
  }

  public stop(): void {
    this.sub.unsubscribe();
    this.stop();
}
}
