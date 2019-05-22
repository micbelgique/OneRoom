import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { MatSnackBar } from '@angular/material';

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

  constructor(private router: Router, private toast: MatSnackBar) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url === '/lock' || event.url === '/') {
          this.showActions = false;
          this.actions.emit('chatbot_close');
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
    if (localStorage.getItem('user')) {
      this.actions.emit('chatbot');
    } else {
      this.toast.open('Connectez-vous pour utiliser le chatbot', 'ok', {
        duration : 2000
      });
    }
  }

}
