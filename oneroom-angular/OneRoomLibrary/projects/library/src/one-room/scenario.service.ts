import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndPointGetterService } from '../utilities/end-point-getter.service';
import { Scenario } from './model/Scenario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  constructor(private http: HttpClient, private EPGetter: EndPointGetterService) { }

  // Scenario itself
  getScenarios(): Observable<Scenario[]> {
    return this.http.get<Scenario[]>(this.EPGetter.getEndPointUrl() + '/Scenario');
  }

  getScenario(scenarioId: number): Observable<Scenario> {
    return this.http.get<Scenario>(this.EPGetter.getEndPointUrl() + '/Scenario/' + scenarioId);
  }

  createScenario(scenario: Scenario) {
    return this.http.post(this.EPGetter.getEndPointUrl() + '/Scenario', scenario);
  }

  deleteScenario(scenarioId: number): Observable<Scenario> {
    return this.http.delete<Scenario>(this.EPGetter.getEndPointUrl() + '/Scenario/' + scenarioId);
  }

  // Scenario in Game
  getScenarioByGame(): Observable<Scenario[]> {
    return this.http.get<Scenario[]>(this.EPGetter.getEndPointUrlWithId() + '/Scenario');
  }
}
