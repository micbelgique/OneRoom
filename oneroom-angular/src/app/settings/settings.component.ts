import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  // tslint:disable-next-line:variable-name
  _endPoint = localStorage.getItem('endpoint');
  // tslint:disable-next-line:variable-name
  _subscriptionKey = localStorage.getItem('subscriptionKey');
  tempEndPoint: string;
  tempSubcriptionKey: string;
  testResult: boolean;
  public get endPoint(): string {
    return this._endPoint;
  }
  public set endPoint(endPointEnv: string) {
    this._endPoint = endPointEnv;
    localStorage.setItem('endpoint', endPointEnv);
  }
  public get subscriptionKey(): string {
    return this._subscriptionKey;
  }
  public set subscriptionKey(subscriptionKey: string) {
    this._subscriptionKey = subscriptionKey;
    localStorage.setItem('subscriptionKey', subscriptionKey);
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
    this.endPoint = this.endPoint;
  }
}
