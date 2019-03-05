import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { User } from '@oneroomic/oneroomlibrary';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  user: User;
  constructor(
    private route: Router
  ) { }

  ngOnInit() {
    if (localStorage.getItem('user') == null) {
      this.route.navigate(['/lock']);
    } else {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }
  logOut() {
    localStorage.removeItem('user');
    this.route.navigate(['/lock']);
  }

}
