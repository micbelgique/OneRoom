import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from './model/team';
import { EndPointGetterService } from '../utilities/end-point-getter.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient, private EPGetter: EndPointGetterService) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
    });
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.EPGetter.getEndPointUrlWithId() + '/teams', { headers: this.headers });
  }

  getTeam(teamId: number): Observable<Team> {
    return this.http.get<Team>(this.EPGetter.getEndPointUrlWithId() + '/teams/' + teamId, { headers: this.headers });
  }

  createTeam(numOfTeam: number) {
    return this.http.post(this.EPGetter.getEndPointUrlWithId() + '/teams/' + numOfTeam, { headers: this.headers });
  }

  deleteTeams(): Observable<Team[]> {
    return this.http.delete<Team[]>(this.EPGetter.getEndPointUrlWithId() + '/teams', { headers: this.headers });
  }
}
