import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-analog',
  templateUrl: './analog.component.html',
  styleUrls: ['./analog.component.css']
})
export class AnalogComponent implements OnInit {

  hourRotation;
  minuteRotation;
  secondRotation;

  private hours;
  private minutes;
  private seconds;

  constructor() {
    this.updateTime();
  }

  ngOnInit() {
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const date = new Date();
    this.hours = ((date.getHours() + 11) % 12 + 1);
    this.minutes = date.getMinutes();
    this.seconds = date.getSeconds();
    const hour = this.hours * 30;
    const minute = this.minutes * 6;
    const second = this.seconds * 6;
    this.hourRotation = `rotate(${hour}deg)`;
    this.minuteRotation = `rotate(${minute}deg)`;
    this.secondRotation = `rotate(${second}deg)`;
  }

}
