import { Injectable } from '@angular/core';
import { EndPointGetterService } from '../utilities/end-point-getter.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Challenge } from './models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient, private EPGetter: EndPointGetterService) {
    this.headers = new HttpHeaders({
      'Content-Type' : 'application/json'
    });
   }

  // Challenges itslef
  getChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.EPGetter.getEndPointUrl() + '/Challenges', { headers: this.headers });
  }

  getChallenge(challengeId: number): Observable<Challenge> {
    return this.http.get<Challenge>(this.EPGetter.getEndPointUrl() + '/Challenges/' + challengeId, { headers: this.headers });
  }

  createChallenge(challenge: Challenge): Observable<any> {
    return this.http.post(this.EPGetter.getEndPointUrl() + '/Challenges', challenge, { headers: this.headers });
  }

  updateChallenge(challenge: Challenge): Observable<Challenge> {
    return this.http.put<Challenge>(this.EPGetter.getEndPointUrl() + '/Challenges/' + challenge.challengeId,
      challenge, { headers: this.headers });
  }

  deleteChallenge(challengeId: number): Observable<Challenge> {
    return this.http.delete<Challenge>(this.EPGetter.getEndPointUrl() + '/Challenges/' + challengeId, { headers: this.headers });
  }

  // Challenges in Scenario
  getChallengesByScenario(ScenarioId: number): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.EPGetter.getEndPointUrl() + '/Scenarios/' + ScenarioId + '/Challenges/',
      { headers: this.headers });
  }

  addChallengeToScenario(ScenarioId: number, challenges: Challenge[]): Observable<boolean> {
    return this.http.post<boolean>(this.EPGetter.getEndPointUrl() + '/Scenarios/' + ScenarioId + '/Challenges', challenges,
      { headers: this.headers });
  }

  deleteChallengeFromScenario(ScenarioId: number, challenges: Challenge[]): Observable<boolean> {
    const httpOptions = {
      headers: this.headers, body: challenges
    };
    return this.http.delete<boolean>(this.EPGetter.getEndPointUrl() + '/Scenarios/' + ScenarioId + '/Challenges', httpOptions);
  }

  // Challenges in Teams
  setCompleted(teamId: number, challengeId: number): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.EPGetter.getEndPointUrl() + '/Teams/' + teamId + '/Challenge/' + challengeId,
      { headers: this.headers });
  }
}
