import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { SignalrMethod, SignalrMethods, SignalRCoreService } from './abstracts/signalr';
import { HttpTransportType } from '@aspnet/signalr';
import { User } from './model/user';

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
  private _refreshTeamList = new EventEmitter<boolean>();
  public refreshTeamList  = this._refreshTeamList.asObservable();

  // tslint:disable-next-line:variable-name
  private _highlightUser = new EventEmitter<any>();
  public highlightUser  = this._highlightUser.asObservable();

  // tslint:disable-next-line:variable-name
  private _refreshUser = new EventEmitter<User>();
  public refreshUser = this._refreshUser.asObservable();

  protected url = '/LeaderBoardHub';
  protected transport = HttpTransportType.LongPolling;
  protected connectionTryDelay = 10000;

  protected methods: MonitoringMethods = {
    UpdateUsers: () => this._refreshUserList.emit(true),
    UpdateTeams: () => this._refreshTeamList.emit(true),
    UpdateUser: (result) => this.refreshUser.toPromise(result),
    HighlightUser: (userId) => {
      console.log(userId);
      this._highlightUser.emit(userId);
    }
  };

  constructor() {
    super();
  }

  public run(): Observable<any> {
    return this.start();
  }

  public stopService() {
    this.stop();
  }
}
