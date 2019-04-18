import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';


export enum KEY_CODE {
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  SPACE = 32,
  TAB = 9,
  CTRL = 17
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'launcher';
  opened = false;
  sidenavEmitter = new Subject<boolean>();

  /*
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.router.url !== '/' && this.router.url !== '/lock' && event.keyCode === KEY_CODE.CTRL && !this.isLogged()) {
      // display assistant
      this.toggleAction();
    }

  }*/

  constructor(public router: Router) {}

  ngOnInit(): void {
  }

  toggleAction() {
    this.opened = !this.opened;
    this.sidenavEmitter.next(this.opened);
  }

  setSidenav($event) {
    this.opened = $event;
  }

  isLogged() {
    return  !(localStorage.getItem('user') === null);
  }
}
