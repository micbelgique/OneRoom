import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { User, UserService } from '@oneroomic/oneroomlibrary';
import { MatDialog } from '@angular/material';
import { ModalChangeNameComponent } from '../modal-change-name/modal-change-name.component';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  user: User;

  constructor(
    private route: Router,
    private modal: MatDialog,
    private userService: UserService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('user') == null) {
      this.route.navigate(['/lock']);
    } else {
      this.user = JSON.parse(localStorage.getItem('user'));
      console.log(this.user);
      if (!this.user.isFirstConnected) {
        this.openModal();
      }
    }
  }
  logOut() {
    localStorage.removeItem('user');
    this.route.navigate(['/lock']);
  }
  openModal() {
    const mod = this.modal.open(ModalChangeNameComponent, {
      data: {user: this.user.name}
    });
    mod.afterClosed().subscribe((result) => {
      this.user.name = result;
      this.userService.updateNameUser(this.user).subscribe((userRes) => {
        this.user = userRes;
      }
      );
      console.log(this.user);
    });
  }

}
