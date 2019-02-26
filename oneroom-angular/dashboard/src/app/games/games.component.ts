import { Component, OnInit } from '@angular/core';
import { Game } from '../services/OnePoint/model/game';
import { GameService } from '../services/OnePoint/game.service';
import { PersonGroupService } from '../services/cognitive/person-group.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  games: Game[] = [];
  // column order
  displayedColumns: string[] = ['id', 'name', 'date', 'ucount', 'tcount', 'delete'];
  group: string;

  constructor(
    private gameService: GameService,
    private groupService: PersonGroupService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.refreshGames();
  }

  refreshGames() {
    const res$ = this.gameService.getGames();
    res$.subscribe(
      (games) => {
        this.games = games;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /*getGame() {
    const resGame$ = this.gameService.getGame(this.group);
    resGame$.subscribe( (game: Game) => {
      localStorage.setItem('gameId', game.gameId.toString());
      localStorage.setItem('groupName', game.groupName);
      this.snackBar.open('Game fetched', 'Ok', {
        duration: 3000
      });
    });
  }*/

  createGame() {
    // creating game coordinator
    const resGame$ = this.gameService.createGame(this.group);
    resGame$.subscribe( (game: Game) => {
      localStorage.setItem('gameId', game.gameId.toString());
      this.refreshGames();
      this.snackBar.open('Game Initialized', 'Ok', {
        duration: 3000
      });
      // creating group face
      const res$ = this.groupService.create(this.group, this.group + ' name ');
      res$.subscribe( x => {
        localStorage.setItem('groupName', this.group);
        this.snackBar.open('Group ' + this.group + ' created', 'Ok', {
        duration: 3000
        });
      });
    });
  }

  deleteGame(gameName = null) {
    if (gameName === null) {
      gameName = this.group;
    }
    // deleting game
    const resGame$ = this.gameService.deleteGame(gameName);
    resGame$.subscribe( (game: Game) => {
        this.group = '';
        this.refreshGames();
        localStorage.removeItem('gameId');
        this.snackBar.open('Game removed', 'Ok', {
          duration: 3000
        });
      });
    // deleting face game
    const res$ = this.groupService.delete(gameName);
    res$.subscribe( x => {
      localStorage.removeItem('groupName');
      this.snackBar.open('Group ' + gameName + ' deleted', 'Ok', {
        duration: 3000
      });
    });
  }

}
