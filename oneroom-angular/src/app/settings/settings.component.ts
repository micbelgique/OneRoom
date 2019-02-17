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
    this.saved = !this.saved;
  }
}
