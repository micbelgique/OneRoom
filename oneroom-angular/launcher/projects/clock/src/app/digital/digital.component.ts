import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-digital',
  templateUrl: './digital.component.html',
  styleUrls: ['./digital.component.css']
})
export class DigitalComponent implements OnInit {

  day: string;
  hours: string;
  minutes: string;
  seconds: string;

  constructor() {
    this.updateTime();
  }

  ngOnInit() {
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const date = new Date();
    const options = { weekday: 'long'};
    this.day = date.toLocaleDateString('fr-FR', options);
    const time = date.toLocaleTimeString('fr-FR');
    const arrTime = time.split(':');
    this.hours = arrTime[0];
    this.minutes = arrTime[1];
    this.seconds = arrTime[2];
  }

}
