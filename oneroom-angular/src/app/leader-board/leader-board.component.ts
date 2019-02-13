import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../services/OnePoint/user.service';
import { User } from '../services/OnePoint/model/user';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit {
  users: User[] = [];
  errorMessage: string;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(
      usersList => {
        this.users = usersList;
      },
      error => this.errorMessage = error as any
    );
  }
}
