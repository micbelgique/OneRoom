import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndPointGetterService } from '../utilities/end-point-getter.service';
import { Scenario } from './models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient, private EPGetter: EndPointGetterService) {
    this.headers = new HttpHeaders({
      'Content-Type' : 'application/json'
    });
   }

  // Scenario itself
  getScenarios(): Observable<Scenario[]> {
    return this.http.get<Scenario[]>(this.EPGetter.getEndPointUrl() + '/Scenarios', { headers: this.headers });
  }

  getScenario(scenarioId: number): Observable<Scenario> {
    return this.http.get<Scenario>(this.EPGetter.getEndPointUrl() + '/Scenarios/' + scenarioId, { headers: this.headers });
  }

  createScenario(scenario: Scenario): Observable<any> {
    return this.http.post(this.EPGetter.getEndPointUrl() + '/Scenarios', scenario, { headers: this.headers });
  }

  deleteScenario(scenarioId: number): Observable<Scenario> {
    return this.http.delete<Scenario>(this.EPGetter.getEndPointUrl() + '/Scenarios/' + scenarioId, { headers: this.headers });
  }

  // Scenario in Game
  setScenarioInGame(scenario: Scenario): Observable<Scenario> {
    return this.http.post<Scenario>(this.EPGetter.getEndPointUrlWithId() + '/Scenario', scenario, { headers: this.headers });
  }

  deleteScenarioFromGame(): Observable<Scenario> {
    return this.http.delete<Scenario>(this.EPGetter.getEndPointUrlWithId() + '/Scenario', { headers: this.headers });
  }
}
