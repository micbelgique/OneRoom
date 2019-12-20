import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { User, UserService, Team, TeamService, HubService, Game } from '@oneroomic/oneroomlibrary';
import { MatDialog } from '@angular/material';
import { ModalChangeNameComponent } from '../modal-change-name/modal-change-name.component';
import { DescriptionTeamModalComponent } from '../description-team-modal/description-team-modal.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  user: User;
  teams: Team[] = [];
  teamUser: Team;
  game: Game;
  private updateTeam;
  private deleteTeam;
  private hubServiceSub;

  constructor(
    private route: Router,
    private modal: MatDialog,
    private userService: UserService,
    private teamService: TeamService,
    private hubService: HubService
  ) { }

  ngOnInit() {
    this.game = JSON.parse(localStorage.getItem('gameData'));
    if (localStorage.getItem('user') == null) {
      // this.route.navigate(['/lock']);
    } else {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.teamService.getTeams().subscribe((result) => {
        this.updateTeamList(result);
        if (!this.user.isFirstConnected && this.user.name.toLowerCase().indexOf('person') > -1) {
          this.openModal();
        }
      });
    }
    this.hubServiceSub = this.hubService.run().subscribe(() => this.hubService.joinGroup(this.game.gameId.toString()));
    this.updateTeam = this.hubService.refreshTeamList.subscribe((result) => {
      this.updateTeamList(result);
    });
    this.deleteTeam = this.hubService.deleteTeamList.subscribe((result) => {
      if (this.game.gameId === result) {
        this.deleteTeamList();
      }
    });
  }
  logOut() {
    localStorage.removeItem('user');
    localStorage.removeItem('notes');
    this.route.navigate(['/lock']);
  }
  openDescriptionModal() {
    console.log(this.teamUser);
    const mod = this.modal.open(DescriptionTeamModalComponent, {data: {
      description: this.teamUser.description},
    height: '40%',
    width: '40%'
  });
    mod.afterClosed().subscribe( () => {
      this.teamUser.descriptionAlreadyShowed = true;
      this.teamService.changeStateDescription(this.teamUser).subscribe(() =>
        console.log('updated')
      );
    });
  }
  openModal() {
    const mod = this.modal.open(ModalChangeNameComponent, {
      data: {
        user: this.user.name,
        team: this.teamUser === undefined ? null : this.teamUser.teamName,
        color: this.teamUser === undefined ? null : this.teamUser.teamColor,
        scenario: this.game.scenario.description === undefined ? null : this.game.scenario.description,
      },
      height: '40%',
      width: '40%'
    });
    mod.afterClosed().subscribe((result) => {
      this.user.name = result.user;
      if (this.teamUser !== undefined) {
        // const color = this.hexToRgb(result.color);
        // console.log(color);
        // const colorString = '' + color.r + ',' + color.g + ',' + color.b;
        this.teamUser.teamName = result.team;
        this.teamUser.teamColor = this.teamUser.teamColor;
        this.teamService.editTeam(this.teamUser).subscribe(
          (teamRes) => {
            this.teamUser = teamRes;
          }
        );
      }
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
        localStorage.setItem('teamData', JSON.stringify(item));
        if (!this.teamUser.descriptionAlreadyShowed && this.teamUser.description) {
          this.openDescriptionModal();
        }
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
    if (this.hubService.connected.closed) {
      this.hubService.leaveGroup(this.game.gameId.toString());
      this.hubService.stopService();
    }
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }



}
