import { Injectable } from '@angular/core';
import { EndPointGetterService } from '../utilities/end-point-getter.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Challenge } from './model/challenge';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  constructor(private http: HttpClient, private EPGetter: EndPointGetterService) { }

  // Challenges itslef
  getChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.EPGetter.getEndPointUrl() + '/Challenges');
  }

  getChallenge(challengeId: number): Observable<Challenge> {
    return this.http.get<Challenge>(this.EPGetter.getEndPointUrl() + '/Challenges/' + challengeId);
  }

  createChallenge(challenge: Challenge) {
    return this.http.post(this.EPGetter.getEndPointUrl() + '/Challenges', challenge);
  }

  updateChallenge(challenge: Challenge): Observable<Challenge> {
    return this.http.put<Challenge>(this.EPGetter.getEndPointUrl() + '/Challenges/' + challenge.challengeId, challenge);
  }

  deleteChallenge(challengeId: number): Observable<Challenge> {
    return this.http.delete<Challenge>(this.EPGetter.getEndPointUrl() + '/Challenges/' + challengeId);
  }

  // Challenges in Scenario
  getChallengesByScenario(ScenarioId: number): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.EPGetter.getEndPointUrl() + '/Scenarios/' + ScenarioId + '/Challenges/');
  }

  addChallengeToScenario(ScenarioId: number, challenges: Challenge[]): Observable<boolean> {
    return this.http.post<boolean>(this.EPGetter.getEndPointUrl() + '/Scenarios/' + ScenarioId + '/Challenges', challenges);
  }

  deleteChallengeFromScenario(ScenarioId: number, challenges: Challenge[]): Observable<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: challenges
    };
    return this.http.delete<boolean>(this.EPGetter.getEndPointUrl() + '/Scenarios/' + ScenarioId + '/Challenges', httpOptions);
  }
}
