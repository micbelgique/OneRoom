import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Game, GameState } from './models';
import { Observable } from 'rxjs';
import { EndPointGetterService } from '../utilities/end-point-getter.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gameUrl = localStorage.getItem('endpoint') + '/Games';
  private headers: HttpHeaders;

  constructor(private http: HttpClient, private EPGetter: EndPointGetterService) {
    this.headers = new HttpHeaders({
      'Content-Type' : 'application/json'
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

  switchState(groupName: string, newState: GameState): Observable<number> {
    return this.http.post<number>(this.EPGetter.getEndPointUrl() + '/Games/' + groupName + '/SwitchState/' + newState,
      null, { headers: this.headers });
  }

  createGame(game: Game): Observable<any> {
    return this.http.post(this.EPGetter.getEndPointUrl() + '/Games/', game, { headers: this.headers });
  }

  deleteGame(groupName: string): Observable<any> {
    return this.http.delete(this.EPGetter.getEndPointUrl() + '/Games/' + groupName, { headers: this.headers });
  }

}
