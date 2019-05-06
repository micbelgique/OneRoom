import { Component, OnInit } from '@angular/core';
import { Team, TeamService } from '@oneroomic/oneroomlibrary';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  teams: Team[];
  team = new Team();
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
    this.team = this.teams.filter(t => t.teamName === teamName)[0];
    console.log(this.team);
  }
}
