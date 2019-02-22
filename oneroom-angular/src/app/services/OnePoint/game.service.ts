import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Game } from './model/game';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gameUrl = localStorage.getItem('endpoint') + '/Games';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
    });
  }

  getGame(groupName: string): Observable<Game>  {
    return this.http.get<Game>(this.gameUrl + '/' + groupName, { headers: this.headers });
  }

  createGame(groupName: string) {
    return this.http.post(this.gameUrl + '/' + groupName, { headers: this.headers });
  }

  deleteGame(groupName: string) {
    return this.http.delete(this.gameUrl + '/' + groupName, { headers: this.headers });
  }
}
