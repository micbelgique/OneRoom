import { Component, OnInit } from '@angular/core';
import { PersonGroupService } from '../services/cognitive/person-group.service';
import { MatSnackBar } from '@angular/material';
import { GameService } from '../services/OnePoint/game.service';
import { Game } from '../services/OnePoint/model/game';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  // coordinator
  endPoint: string;
  group: string;

  games: Game[];

  constructor(
    private toast: MatSnackBar,
    private gameService: GameService) {}

  ngOnInit() {
    // group face
    this.group = localStorage.getItem('groupName');
    // coordinator
    this.endPoint = localStorage.getItem('endpoint');
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
    this.toast.open('Settings updated', 'Ok', {
      duration: 2000
    });
  }

  getGame() {
    const resGame$ = this.gameService.getGame(this.group);
    resGame$.subscribe( (game: Game) => {
      localStorage.setItem('gameId', game.gameId.toString());
      localStorage.setItem('groupName', game.groupName);
      this.toast.open('Game fetched', 'Ok', {
        duration: 3000
      });
    });
  }
}
