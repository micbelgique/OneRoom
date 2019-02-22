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

  // coordinator
  endPoint: string;
  // Face
  subscriptionKey: string;
  endPointCognitive: string;
  callFaceStatus = true;
  group = '';
  // Custom vision
  subscriptionKeyCustomVision: string;
  endPointCustomVision: string;
  callCustomVisionStatus = true;

  constructor(
    private snackBar: MatSnackBar,
    private groupService: PersonGroupService) {}

  ngOnInit() {
    // group face
    this.group = localStorage.getItem('groupid');
    // coordinator
    this.endPoint = localStorage.getItem('endpoint');
    // face
    this.endPointCognitive = localStorage.getItem('endpointCognitive');
    this.subscriptionKey = localStorage.getItem('subscriptionKey');
    this.callFaceStatus = localStorage.getItem('cognitiveStatus') === 'true' ? true : false;
    // custom vision
    this.subscriptionKeyCustomVision = localStorage.getItem('subscriptionKeyCustomVision');
    this.endPointCustomVision = localStorage.getItem('endPointCustomVision');
    this.callCustomVisionStatus = localStorage.getItem('customVisionStatus') === 'true' ? true : false;
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

  saveCustomVisionSettings(): void {
    localStorage.setItem('endPointCustomVision', this.endPointCustomVision);
    localStorage.setItem('subscriptionKeyCustomVision', this.subscriptionKeyCustomVision);
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

  toggleFaceCalls() {
    const status = localStorage.getItem('cognitiveStatus');
    if (status === 'true') {
      localStorage.setItem('cognitiveStatus', 'false');
      this.snackBar.open('Calls face disabled', 'Ok', {
        duration: 2000
      });
    } else {
      localStorage.setItem('cognitiveStatus', 'true');
      this.snackBar.open('Calls face enabled', 'Ok', {
        duration: 2000
      });
    }
  }

  toggleCustomVisionCalls() {
    const status = localStorage.getItem('customVisionStatus');
    if (status === 'true') {
      localStorage.setItem('customVisionStatus', 'false');
      this.snackBar.open('Calls custom vision disabled', 'Ok', {
        duration: 2000
      });
    } else {
      localStorage.setItem('customVisionStatus', 'true');
      this.snackBar.open('Calls custom vision enabled', 'Ok', {
        duration: 2000
      });
    }
  }
}
