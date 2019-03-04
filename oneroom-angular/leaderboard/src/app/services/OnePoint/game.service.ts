import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Game } from './model/game';
import { Observable } from 'rxjs';
import { EndPointGetterService } from 'src/app/utilities/end-point-getter.service';

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

  getGame(groupName: string): Observable<Game>  {
    return this.http.get<Game>(this.EPGetter.getEndPointUrl() + '/Games/' + groupName, { headers: this.headers });
  }

  getGames(): Observable<Game[]>  {
    return this.http.get<Game[]>(this.EPGetter.getEndPointUrl() + '/Games/', { headers: this.headers });
  }

  createGame(groupName: string) {
    return this.http.post(this.EPGetter.getEndPointUrl() + '/Games/' + groupName, { headers: this.headers });
  }

  deleteGame(groupName: string) {
    return this.http.delete(this.EPGetter.getEndPointUrl() + '/Games/' + groupName, { headers: this.headers });
  }
}
