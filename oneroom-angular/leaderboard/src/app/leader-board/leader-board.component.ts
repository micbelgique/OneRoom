import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/OnePoint/user.service';
import { User } from '../services/OnePoint/model/user';
import { MatSnackBar } from '@angular/material';
import { LeaderboardService } from '../services/OnePoint/leaderboard.service';
import { TeamService } from '../services/OnePoint/team.service';
import { Team } from '../services/OnePoint/model/team';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit, OnDestroy {

  users: User[] = [];
  teams: Team[] = [];
  errorMessage: string;
  refreshBtn = true;
  title = localStorage.getItem('groupName');

  private timeSubscription;
  private userSub;
  private userNotifySub;
  private teamSub;
  private teamNotifySub;
  private hubServiceSub;

  constructor(
    private userService: UserService,
    private teamService: TeamService,
    private snackBar: MatSnackBar,
    private hubService: LeaderboardService) { }

  ngOnInit() {
    // attach to event from hub
    this.hubServiceSub = this.hubService.run().subscribe();
    this.userNotifySub = this.hubService.refreshUserList.subscribe(() => {
      this.refreshUserList();
    });
    this.teamNotifySub = this.hubService.refreshTeamList.subscribe(() => {
      this.refreshTeamList();
    });
    this.refreshUserList();
    this.refreshTeamList();
  }

  private refreshUserList() {
    this.userSub = this.userService.getUsers().subscribe(
      (usersList) => {
        // usersList.forEach( u => { User.generateAvatar(u); });
        this.users = usersList;
        this.snackBar.open(this.users.length + ' players retrieved', 'Ok', {
          duration: 1000
        });
      },
      error => this.errorMessage = error as any
    );
  }

  private refreshTeamList() {
    this.teamSub = this.teamService.getTeams().subscribe(
      (teamList) => {
        this.teams = teamList;
        this.snackBar.open(this.teams.length + ' teams retrieved', 'Ok', {
          duration: 1000
        });
      },
      error => this.errorMessage = error as any
    );
  }

  ngOnDestroy() {
    if (this.hubServiceSub) {
      this.hubServiceSub.unsubscribe();
    }
    if (this.userNotifySub) {
      this.userNotifySub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.teamSub) {
      this.teamSub.unsubscribe();
    }
    if (this.teamNotifySub) {
      this.teamNotifySub.unsubscribe();
    }
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
    if (!this.hubService.connected.isStopped) {
      this.hubService.stopService();
    }
  }
}
