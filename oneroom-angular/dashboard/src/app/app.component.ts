import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { stringify } from '@angular/core/src/render3/util';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Dashboard Admin';
  opened = false;

  constructor() {}

  toggleMenu(): void {
    this.opened = !this.opened;
  }
}
