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

  // Challenges in Game
  getChallengesByGame(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.EPGetter.getEndPointUrlWithId() + '/Challenges');
  }

  addChallengeToGame(challengeIds: number[]): Observable<boolean> {
    return this.http.post<boolean>(this.EPGetter.getEndPointUrlWithId() + '/Challenges', challengeIds);
  }

  deleteChallengeFromGame(challengeIds: number[]): Observable<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: challengeIds
    };
    return this.http.delete<boolean>(this.EPGetter.getEndPointUrlWithId() + '/Challenges', httpOptions);
  }
}
