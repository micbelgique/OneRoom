import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndPointGetterService } from '../utilities/end-point-getter.service';
import { Scenario } from './model/scenario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  constructor(private http: HttpClient, private EPGetter: EndPointGetterService) { }

  // Scenario itself
  getScenarios(): Observable<Scenario[]> {
    return this.http.get<Scenario[]>(this.EPGetter.getEndPointUrl() + '/Scenarios');
  }

  getScenario(scenarioId: number): Observable<Scenario> {
    return this.http.get<Scenario>(this.EPGetter.getEndPointUrl() + '/Scenarios/' + scenarioId);
  }

  createScenario(scenario: Scenario) {
    return this.http.post(this.EPGetter.getEndPointUrl() + '/Scenarios', scenario);
  }

  deleteScenario(scenarioId: number): Observable<Scenario> {
    return this.http.delete<Scenario>(this.EPGetter.getEndPointUrl() + '/Scenarios/' + scenarioId);
  }

  // Scenario in Game
  setScenarioInGame(scenario: Scenario): Observable<Scenario> {
    return this.http.post<Scenario>(this.EPGetter.getEndPointUrlWithId() + '/Scenario', scenario);
  }

  deleteScenarioFromGame(): Observable<Scenario> {
    return this.http.delete<Scenario>(this.EPGetter.getEndPointUrlWithId() + '/Scenario');
  }
}
