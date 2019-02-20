import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PersonGroupService } from '../services/cognitive/person-group.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  // tslint:disable-next-line:variable-name
  // _endPoint = environment.Data.EndPoint;
  // tslint:disable-next-line:variable-name
  // _subscriptionKey = environment.faceApi.SubscriptionKey;
  // tslint:disable-next-line:variable-name
  // _endPointCognitive = environment.faceApi.EndPoint;

  endPoint: string;
  subscriptionKey: string;
  endPointCognitive: string;

  group = '';
  callStatus = true;

  constructor(
    private snackBar: MatSnackBar,
    private groupService: PersonGroupService) {}

  ngOnInit() {
    this.group = localStorage.getItem('groupid');
    this.endPoint = localStorage.getItem('endpoint');
    this.endPointCognitive = localStorage.getItem('endpointCognitive');
    this.subscriptionKey = localStorage.getItem('subscriptionKey');
    this.callStatus = localStorage.getItem('cognitiveStatus') === 'true' ? true : false;
  }

  saveCoordinatorSettings(): void {
    localStorage.setItem('endpoint', this.endPoint);
    this.snackBar.open('Settings updated', 'Ok', {
      duration: 2000
    });
  }

  saveFaceSettings(): void {
    localStorage.setItem('endpointCognitive', this.endPointCognitive);
    localStorage.setItem('subscriptionKey', this.subscriptionKey);
    this.snackBar.open('Settings updated', 'Ok', {
      duration: 2000
    });
  }

  create() {
    const res$ = this.groupService.create(this.group, this.group + ' name ');
    res$.subscribe( x => {
      localStorage.setItem('groupid', this.group);
      this.snackBar.open('Group ' + this.group + ' created', 'Ok', {
        duration: 3000
      });
      console.log(x);
    });
  }

  delete() {
    const res$ = this.groupService.delete(this.group);
    res$.subscribe( x => {
      localStorage.removeItem('groupid');
      this.snackBar.open('Group ' + this.group + ' deleted', 'Ok', {
        duration: 3000
      });
      console.log(x);
    });
  }

  toggleCognitiveCalls() {
    const status = localStorage.getItem('cognitiveStatus');
    if (status === 'true') {
      localStorage.setItem('cognitiveStatus', 'false');
      this.snackBar.open('Calls disabled', 'Ok', {
        duration: 2000
      });
    } else {
      localStorage.setItem('cognitiveStatus', 'true');
      this.snackBar.open('Calls enabled', 'Ok', {
        duration: 2000
      });
    }
  }
}
