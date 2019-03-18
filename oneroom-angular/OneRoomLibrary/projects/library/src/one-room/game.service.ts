import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Game } from './model/game';
import { Observable } from 'rxjs';
import { EndPointGetterService } from '../utilities/end-point-getter.service';
import { GameState } from './model/game-state.enum';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gameUrl = localStorage.getItem('endpoint') + '/Games';
  private headers: HttpHeaders;

  constructor(private http: HttpClient, private EPGetter: EndPointGetterService) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
    });
  }
  getStateGame(groupName: string): Observable<number> {
    return this.http.get<number>(this.EPGetter.getEndPointUrl() + '/Games/' + groupName + '/State', { headers: this.headers });
  }
  getGames(): Observable<Game[]>  {
    return this.http.get<Game[]>(this.EPGetter.getEndPointUrl() + '/Games/', { headers: this.headers });
  }

  getGame(groupName: string): Observable<Game>  {
    return this.http.get<Game>(this.EPGetter.getEndPointUrl() + '/Games/' + groupName, { headers: this.headers });
  }

  disconnect(groupName: string): Observable<Game> {
    return this.http.get<Game>(this.EPGetter.getEndPointUrl() + '/Games/' + groupName + '/Disconnect/', { headers: this.headers });
  }

  switchState(groupName: string, newState: GameState): Observable<number> {
    return this.http.post<number>(this.EPGetter.getEndPointUrl() + '/Games/' + groupName + '/SwitchState/' + newState, null);
  }

  createGame(game: Game) {
    console.log(game);
    return this.http.post(this.EPGetter.getEndPointUrl() + '/Games/', game, { headers: this.headers });
  }

  deleteGame(groupName: string) {
    return this.http.delete(this.EPGetter.getEndPointUrl() + '/Games/' + groupName, { headers: this.headers });
  }

}
