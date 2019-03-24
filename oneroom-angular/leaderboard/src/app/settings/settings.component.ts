import { Component, OnInit } from '@angular/core';
// import { PersonGroupService } from '../services/cognitive/person-group.service';
import { MatSnackBar } from '@angular/material';
import { GameService, Game } from '@oneroomic/oneroomlibrary';
// import { GameService } from '../services/OnePoint/game.service';
// import { Game } from '../services/OnePoint/model/game';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  // coordinator
  endPoint: string;
  group: string;
  minimumRecognized: number;

  // available games
  games: Game[];

  // current game
  game: Game;

  constructor(
    private toast: MatSnackBar,
    private gameService: GameService) {}

  ngOnInit() {
    if (localStorage.getItem('minimumRecognized')) {
      this.minimumRecognized = Number(localStorage.getItem('minimumRecognized'));
    } else {
      this.minimumRecognized = 3;
    }

    if (localStorage.getItem('gameData')) {
      this.game = JSON.parse(localStorage.getItem('gameData'));
    }

    if (localStorage.getItem('endpoint')) {
      this.endPoint = localStorage.getItem('endpoint');
    }
    // group face
    // this.group = localStorage.getItem('groupName');

    // load available games from coordinator
    this.games = [];
    this.loadGames();
  }

  loadGames() {
    this.gameService.getGames().subscribe(
        (games) => {
          this.toast.open(games.length + ' games found', 'Ok', {
            duration: 1000
          });
          this.games = games;
        },
        (err) => {
          console.log(err);
        }
      );
  }


  saveCoordinatorSettings(): void {
    localStorage.setItem('endpoint', this.endPoint);
    this.loadGames();
    this.toast.open('Settings updated', 'Ok', {
      duration: 2000
    });
  }

  getGame() {
    this.gameService.getGame(this.group).subscribe( (game: Game) => {
      this.game = game;
      localStorage.setItem('gameData', JSON.stringify(game));
      // localStorage.setItem('gameId', game.gameId.toString());
      localStorage.setItem('groupName', game.groupName);
      localStorage.setItem('minimumRecognized', '' + game.config.minimumRecognized);
      this.minimumRecognized = game.config.minimumRecognized;
      this.toast.open('Game fetched', 'Ok', {
        duration: 3000
      });
    });
  }
}
