import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {

  toggleClock = false;

  constructor() {
  }

  ngOnInit() {}

  switchClock() {
    this.toggleClock = !this.toggleClock;
  }
}
