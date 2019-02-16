import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/OnePoint/user.service';
import { User } from '../services/OnePoint/model/user';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit {
  @Input()
  users: User[] = [];
  errorMessage: string;
  private timeSubscription;
  private userSub;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getData();
  }
  private getData(): void {
    this.userSub = this.userService.getUsers().subscribe(
      usersList => {
        this.users = usersList;
        this.refreshData();
      },
      error => this.errorMessage = error as any
    );
  }
  private refreshData(): void {
    this.timeSubscription = timer(5000).subscribe(val => this.getData());
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }
}
