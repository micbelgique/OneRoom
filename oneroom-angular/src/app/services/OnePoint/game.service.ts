import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Game } from './model/game';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public static readonly GAME_URL = localStorage.getItem('endpoint') + '/Games';
  public static readonly GAME_URL_WITH_ID = localStorage.getItem('endpoint') + '/Games/' + localStorage.getItem('GameID');
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
    });
  }

  getGame(): Observable<Game>  {
    return this.http.get<Game>(GameService.GAME_URL_WITH_ID, { headers: this.headers });
  }

  createGame(groupName: string) {
    return this.http.post(GameService.GAME_URL + '/' + groupName, { headers: this.headers });
  }

  deleteGame(gameID: number) {
    return this.http.delete(GameService.GAME_URL + '/' + gameID, { headers: this.headers });
  }
}
