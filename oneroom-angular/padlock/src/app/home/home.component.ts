import { Component, OnInit } from '@angular/core';
import { Team, TeamService, User } from '@oneroomic/oneroomlibrary';
import { HairColorType } from '@oneroomic/oneroomlibrary/one-room/model/hair-color-type.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  teams: Team[];
  team = new Team();
  UserWanted = new User();
  constructor(
    private teamService: TeamService
  ) { }

  ngOnInit() {
    this.getTeams();
  }
  getTeams() {
    this.teamService.getTeams().subscribe(
      (result) => {
        this.teams = result;
        console.log(this.teams);
      }
    );
  }
  getTeam(teamName: string) {
    this.team = null;
    this.team = this.teams.filter(t => t.teamName === teamName)[0];
    this.generateUserForTeam();
  }
  generateUserForTeam() {
    const result = [
      this.team.users.filter(u => u.hairColor === 'blond').length,
      this.team.users.filter(u => u.hairColor === 'brown').length,
      this.team.users.filter(u => u .hairColor === 'red').length,
      this.team.users.filter(u => u.hairColor === 'white').length
    ];
    const best = this.findMinResult(result);
    switch (best) {
      case 0:
        this.UserWanted.hairColor = 'blond';
        if (this.team.users.filter(u => u.hairColor === 'blond' && u.skinColor === 'black').length >= 1) {
          this.UserWanted.skinColor = 'black';
        } else if (this.team.users.filter(u => u.hairColor === 'blond' && u.skinColor === 'azian').length >= 1) {
          this.UserWanted.skinColor = 'azian';
        } else {
          this.UserWanted.skinColor = 'caucasian';
        }
        console.log(this.UserWanted);
        break;
      case 1:
      this.UserWanted.hairColor = 'brown';
      if (this.team.users.filter(u => u.hairColor === 'brown' && u.skinColor === 'black').length >= 1) {
        this.UserWanted.skinColor = 'black';
      } else if (this.team.users.filter(u => u.hairColor === 'brown' && u.skinColor === 'azian').length >= 1) {
        this.UserWanted.skinColor = 'azian';
      } else {
        this.UserWanted.skinColor = 'caucasian';
      }
      console.log(this.UserWanted);
      break;
      case 2:
      this.UserWanted.hairColor = 'red';
      if (this.team.users.filter(u => u.hairColor === 'red' && u.skinColor === 'black').length >= 1) {
        this.UserWanted.skinColor = 'black';
      } else if (this.team.users.filter(u => u.hairColor === 'red' && u.skinColor === 'azian').length >= 1) {
        this.UserWanted.skinColor = 'azian';
      } else {
        this.UserWanted.skinColor = 'caucasian';
      }
      console.log(this.UserWanted);
      break;
      case 3:
      this.UserWanted.hairColor = 'white';
      if (this.team.users.filter(u => u.hairColor === 'white' && u.skinColor === 'black').length >= 1) {
        this.UserWanted.skinColor = 'black';
      } else if (this.team.users.filter(u => u.hairColor === 'white' && u.skinColor === 'azian').length >= 1) {
        this.UserWanted.skinColor = 'azian';
      } else {
        this.UserWanted.skinColor = 'caucasian';
      }
      console.log(this.UserWanted);
      break;
      default:
        break;
    }
  }
  findMinResult(res: number[]): number {
    let result = Math.max(...res);
    let resultPos = -1;
    for (let index = 0; index < res.length; index++) {
      if (res[index] > 0 && result >= res[index]) {
        result = res[index];
        resultPos = index;
      }
    }
    return resultPos;
  }
}
