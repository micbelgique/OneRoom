import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {

  showActions = false;
  showActionChatbot = false;

  @Output()
  actions: EventEmitter<string> = new EventEmitter();

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url === '/lock' || event.url === '/') {
          this.showActions = false;
          console.log('hiding controls');
        } else {
          this.showActions = true;
        }
      }
    });
   }

  ngOnInit() {
  }

  returnHome() {
    if (localStorage.getItem('user') == null) {
      this.router.navigate(['/lock']);
    } else if (this.router.url === '/nav') {

    } else {
      this.router.navigateByUrl('/nav');
    }
  }

  toggleChatbot() {
    this.actions.emit('chatbot');
  }

}
