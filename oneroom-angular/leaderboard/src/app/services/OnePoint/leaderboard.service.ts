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
  private _refreshUserList = new EventEmitter<User[]>();
  public refreshUserList  = this._refreshUserList.asObservable();

  // tslint:disable-next-line:variable-name
  private _refreshTeamList = new EventEmitter<boolean>();
  public refreshTeamList  = this._refreshTeamList.asObservable();

  // tslint:disable-next-line:variable-name
  private _highlightUser = new EventEmitter<any>();
  public highlightUser  = this._highlightUser.asObservable();

  // tslint:disable-next-line:variable-name
  private _refreshUser = new EventEmitter<any>();
  public refreshUser = this._refreshUser.asObservable();

  // tslint:disable-next-line:variable-name
  private _createUser = new EventEmitter<any>();
  public createUser = this._createUser.asObservable();

  // tslint:disable-next-line:variable-name
  private _deleteUser = new EventEmitter<any>();
  public deleteUser = this._deleteUser.asObservable();

  protected url = '/LeaderBoardHub';
  protected transport = HttpTransportType.LongPolling;
  protected connectionTryDelay = 10000;

  protected methods: MonitoringMethods = {
    UpdateUsers: (Users) => this._refreshUserList.emit(Users),
    UpdateTeams: () => this._refreshTeamList.emit(true),
    UpdateUser: (result) => this._refreshUser.emit(result),
    CreateUser: (result) => this._createUser.emit(result),
    DeleteUser: (result) => this._deleteUser.emit(result),
    HighlightUser: (userId) => {
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
