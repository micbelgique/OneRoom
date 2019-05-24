import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  // coordinator
  endPoint: string;

  constructor(private notifierService: NotifierService) {}

  ngOnInit() {
    // coordinator
    this.endPoint = localStorage.getItem('endpoint');
  }

  saveCoordinatorSettings(): void {
    localStorage.setItem('endpoint', this.endPoint);
    this.notifierService.notify( 'success', 'Settings updated' );
  }

}
