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
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getData();
  }
  private getData(): void {
    this.userService.getUsers().subscribe(
      usersList => {
        this.users = usersList;
        this.refreshData();
      },
      error => this.errorMessage = error as any
    );
  }
  private refreshData(): void {
    this.timeSubscription = timer(5000);
    const sub = this.timeSubscription.subscribe(val => this.getData());
  }
}
