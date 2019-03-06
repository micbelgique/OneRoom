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
  private userCreateSub;
  private teamSub;
  private teamNotifySub;
  private hubServiceSub;

  private hightlightUserSub;
  private detectedUserId;

  constructor(
    private userService: UserService,
    private teamService: TeamService,
    private hubService: LeaderboardService) { }

  ngOnInit() {
    this.detectedUserId = '';
    // attach to event from hub
    this.hubServiceSub = this.hubService.run().subscribe();
    // this.userNotifySub = this.hubService.refreshUserList.subscribe(() => {
    //   this.refreshUserList();
    // });
    this.userNotifySub = this.hubService.refreshUser.subscribe( (result) => {
      this.updateUser(result);
    });
    this.userCreateSub = this.hubService.createUser.subscribe( (result) => {
      this.createUser(result);
    });
    this.teamNotifySub = this.hubService.refreshTeamList.subscribe(() => {
      this.refreshTeamList();
    });
    this.hightlightUserSub = this.hubService.highlightUser.subscribe((userId: number) => {
      this.detectedUserId = userId;
      setTimeout( () => {
        this.detectedUserId = '';
      }, 5000);
    });

    this.getUserList();
    this.refreshTeamList();
  }

  private getUserList() {
    this.userSub = this.userService.getUsers().subscribe(
      (usersList) => {
        usersList.forEach( u => { User.generateAvatar(u); });
        this.users = usersList;
      },
      error => this.errorMessage = error as any
    );
  }
  private updateUser(user: User) {
    const u = this.users.findIndex(e => e.userId === user.userId);
    this.users[u] = user;
  }

  private createUser(user: User) {
    this.users.push(user);
  }

  private refreshTeamList() {
    this.teamSub = this.teamService.getTeams().subscribe(
      (teamList) => {
        this.teams = teamList;
        this.teams.forEach( t => t.users.forEach( u => { User.generateAvatar(u); }));
      },
      error => this.errorMessage = error as any
    );
  }

  isHighLighted(userId: number): string {
    if (userId === this.detectedUserId) {
      return '15px 15px 5px grey';
    } else {
      return '';
    }
  }

  getTeamColor(color: string) {
    if (color) {
      return 'rgb(' + color + ')';
    }
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
    if (this.hightlightUserSub) {
      this.hightlightUserSub.unsubscribe();
    }
    if (!this.hubService.connected.isStopped) {
      this.hubService.stopService();
    }
    if (this.userCreateSub) {
      this.userCreateSub.unsubscribe();
    }
  }
}
