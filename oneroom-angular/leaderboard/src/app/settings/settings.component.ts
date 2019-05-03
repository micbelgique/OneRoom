import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { GameService, Game } from '@oneroomic/oneroomlibrary';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  // coordinator
  endPoint: string;
  minimumRecognized: number;

  // available games
  games: Game[];

  // current game
  game: Game;

  constructor(
    private toast: MatSnackBar,
    private gameService: GameService) {}

  ngOnInit() {
    this.games = [];
    this.game = new Game();

    if (localStorage.getItem('groupName')) {
      this.getGame(localStorage.getItem('groupName'));
    } else {
      this.game = new Game();
      this.game.groupName = null;
      this.minimumRecognized = 3;
    }

    if (localStorage.getItem('endpoint')) {
      this.endPoint = localStorage.getItem('endpoint');
      // load available games from coordinator
      this.loadGames();
    } else {
      this.endPoint = '';
    }
    // group face
    // this.group = localStorage.getItem('groupName');
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

  getGame(groupName: string) {
    this.gameService.getGame(groupName).subscribe( (game: Game) => {
      this.game = game;
      localStorage.setItem('gameData', JSON.stringify(game));
      localStorage.setItem('groupName', game.groupName);
      this.minimumRecognized = game.config.minimumRecognized;
      this.toast.open('Game fetched', 'Ok', {
        duration: 3000
      });
    });
  }
}
