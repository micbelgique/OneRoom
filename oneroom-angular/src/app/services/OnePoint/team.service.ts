import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from './model/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private teamUrl = localStorage.getItem('endpoint') + '/teams';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
    });
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.teamUrl, { headers: this.headers });
  }

  getTeam(teamId: number): Observable<Team> {
    return this.http.get<Team>(this.teamUrl + '/' + teamId, { headers: this.headers });
  }

  createTeam(numOfTeam: number) {
    return this.http.post(this.teamUrl + '/' + numOfTeam, { headers: this.headers });
  }

  deleteTeams(): Observable<Team[]> {
    return this.http.delete<Team[]>(this.teamUrl, { headers: this.headers });
  }

  deleteTeam(userId: string): Observable<Team> {
    return this.http.delete<Team>(this.teamUrl + '/' + userId, { headers: this.headers });
  }
}
