import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  // tslint:disable-next-line:variable-name
  _endPoint = environment.Data.EndPoint;
  // tslint:disable-next-line:variable-name
  _subscriptionKey = environment.faceApi.SubscriptionKey;
  // tslint:disable-next-line:variable-name
  _endPointCognitive = environment.faceApi.EndPoint;
  tempEndPoint: string;
  tempSubcriptionKey: string;
  tempEndPointCognitive: string;
  testResult: boolean;
  saved = true;
  public get endPoint(): string {
    return this._endPoint;
  }
  public set endPoint(endPoint: string) {
    this._endPoint = endPoint;
    localStorage.removeItem('endpoint');
    localStorage.setItem('endpoint', endPoint);
  }
  public get subscriptionKey(): string {
    return this._subscriptionKey;
  }
  public set subscriptionKey(subscriptionKey: string) {
    this._subscriptionKey = subscriptionKey;
    localStorage.removeItem('subscriptionKey');
    localStorage.setItem('subscriptionKey', subscriptionKey);
  }
  public get endPointCognitive(): string {
    return this._endPointCognitive;
  }
  public set endPointCognitive(v: string) {
    this._endPointCognitive = v;
    localStorage.removeItem('endpointCognitive');
    localStorage.setItem('endpointCognitive', v);
  }

  constructor() {}

  ngOnInit() {
  }
  verifyEndPoint(): boolean {
    // Not implemented
    return true;
  }
  verifySub(): boolean {
    // Not implemented
    return true;
  }
  test(): void {
    this.testResult = this.verifyEndPoint() && this.verifySub();
  }
  save(): void {
    this.subscriptionKey = this.tempSubcriptionKey;
    this.endPoint = this.tempEndPoint;
    this.endPointCognitive = this.tempEndPointCognitive;
    this.saved = !this.saved;
  }
}
