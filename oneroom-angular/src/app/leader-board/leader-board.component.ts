import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UserService } from '../services/OnePoint/user.service';
import { User } from '../services/OnePoint/model/user';
import { timer } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Gender } from '../services/OnePoint/model/gender.enum';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit, OnDestroy {

  users: User[] = [];
  errorMessage: string;
  refreshBtn = true;

  private timeSubscription;
  private userSub;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getData();
  }

  private getData(): void {
    this.userSub = this.userService.getUsers().subscribe(
      (usersList) => {
        usersList.forEach( u => { User.generateAvatar(u); });
        this.users = usersList;
        this.snackBar.open(this.users.length + ' players retrieved', 'Ok', {
          duration: 3000
        });
        // this.refreshData();
        timer(2500).subscribe( () => {this.refreshBtn = true; });
      },
      error => this.errorMessage = error as any
    );
  }

  refreshData(): void {
    this.refreshBtn = false;
    this.timeSubscription = this.getData();
    // timer(2000).subscribe(val => this.getData());
  }

  deletePlayer($userIdClicked) {
    const $del = this.userService.deleteUser($userIdClicked);
    $del.subscribe( x => {
      let idx = -1;
      this.users.forEach( (u, index)  => {
        if ( u.userId === x.userId) {
            idx = index;
        }
      });
      // delete
      this.users.splice(idx, 1);
    },
    (error) => {
      console.log(error);
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }
}
