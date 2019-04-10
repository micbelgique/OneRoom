import { Component, OnInit } from '@angular/core';
// import { TeamService } from '../services/OnePoint/team.service';
import { MatSnackBar } from '@angular/material';
import { Team, Game, GameService, TeamService } from '@oneroomic/oneroomlibrary';
// import { GameService } from '../services/OnePoint/game.service';
// import { Game } from '../services/OnePoint/model/game';
// import { Team } from '../services/OnePoint/model/team';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  nbTeams: number;
  teams: Team[] = [];
  games: Game[];
  // column order
  displayedColumns: string[] = ['Name', 'Color', 'Users'];

  constructor(private snackBar: MatSnackBar, private gameService: GameService, private teamService: TeamService) { }

  ngOnInit() {
    this.teams = [];
    this.games = [];
    this.nbTeams = 4;
    this.loadGames();
  }

  loadGames() {
    this.gameService.getGames().subscribe(
        (games) => {
          this.snackBar.open(games.length + ' games found', 'Ok', {
            duration: 1000
          });
          this.games = games;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  loadTeams(idGame: number = null) {
    if (idGame !== null) {
      localStorage.setItem('gameId', '' + idGame);
    }
    this.teamService.getTeamsByGame(idGame).subscribe(
        (teams) => {
          this.snackBar.open(teams.length + ' teams retrived', 'Ok', {
            duration: 1000
          });
          this.teams = teams;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  createTeam() {
    const res$ = this.teamService.createTeam(this.nbTeams);
    res$.subscribe( (teams: Team[]) => {
      this.snackBar.open('Teams Created', 'Ok', {
        duration: 3000
      });
      this.teams = teams;
    });
  }

  deleteTeams() {
    const res$ = this.teamService.deleteTeams();
    res$.subscribe( x => {
      this.snackBar.open('Teams deleted', 'Ok', {
        duration: 3000
      });
      this.teams = [];
    });
  }

  getTeamColor(color: string) {
    if (color) {
      return 'rgb(' + color + ')';
    }
  }
}
