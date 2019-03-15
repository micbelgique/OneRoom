import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { User, UserService, Team, TeamService, LeaderboardService } from '@oneroomic/oneroomlibrary';
import { MatDialog } from '@angular/material';
import { ModalChangeNameComponent } from '../modal-change-name/modal-change-name.component';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  user: User;
  teams: Team[];
  teamUser: Team;
  private updateTeam;
  private deleteTeam;
  private hubServiceSub;

  constructor(
    private route: Router,
    private modal: MatDialog,
    private userService: UserService,
    private teamService: TeamService,
    private hubService: LeaderboardService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('user') == null) {
      this.route.navigate(['/lock']);
    } else {
      this.user = JSON.parse(localStorage.getItem('user'));
      if (!this.user.isFirstConnected && this.user.name.toLowerCase().indexOf('person') > -1) {
        this.openModal();
      }
      this.teamService.getTeams().subscribe((result) => {
        this.updateTeamList(result);
      });
    }
    this.hubServiceSub = this.hubService.run().subscribe();
    this.updateTeam = this.hubService.refreshTeamList.subscribe((result) => {
      this.updateTeamList(result);
    });
    this.deleteTeam = this.hubService.deleteTeamList.subscribe((result) => {
      if (JSON.parse(localStorage.getItem('gameData')).gameId === result) {
        this.deleteTeamList();
      }
    });
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
      this.userService.updateNameUser(this.user).subscribe(
      (userRes) => {
        this.user = userRes;
        // save user
        localStorage.setItem('user', JSON.stringify(userRes));
      }
      );
    });
  }
  updateTeamList(teams: Team[]) {
    this.teams = teams;
    for (const item of this.teams) {
      if (item.users.some(x => x.userId === this.user.userId)) {
        this.teamUser = item;
       }
    }
  }
  deleteTeamList() {
    this.teamUser = null;
  }
  getColorTeam() {
    if (this.teamUser) {
      return 'rgb(' + this.teamUser.teamColor + ')';
    }
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    if (this.hubServiceSub) {
      this.hubServiceSub.unsubscribe();
    }
    if (this.updateTeam) {
      this.updateTeam.unsubscribe();
    }
    if (this.deleteTeam) {
      this.deleteTeam.unsubscribe();
    }
    if (!this.hubService.connected.isStopped) {
      this.hubService.stopService();
    }
  }
}
