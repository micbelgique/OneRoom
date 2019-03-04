import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

export enum KEY_CODE {
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  SPACE = 32
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Leaderboard';
  opened = false;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if ( event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.opened = true;
    } else if ( event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.opened = false;
    } else if (event.keyCode === KEY_CODE.SPACE) {
      this.toggleMenu();
    }
  }

  constructor(public router: Router) {

  }

  toggleMenu(): void {
    this.opened = !this.opened;
  }
}
