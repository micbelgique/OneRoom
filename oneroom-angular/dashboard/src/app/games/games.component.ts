import { Component, OnInit } from '@angular/core';
import { Game } from '../services/OnePoint/model/game';
import { GameService } from '../services/OnePoint/game.service';
import { PersonGroupService } from '../services/cognitive/person-group.service';
import { MatSnackBar } from '@angular/material';
import { GameState } from '../services/OnePoint/model/game-state.enum';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  // list of launched games
  games: Game[] = [];
  // column order
  displayedColumns: string[] = ['id', 'name', 'date', 'update', 'delete'];
  // game to add
  game: Game;

  gameStates: string[];

  constructor(
    private gameService: GameService,
    private groupService: PersonGroupService,
    private snackBar: MatSnackBar) {
      this.gameStates = Object.keys(GameState).filter(key => !isNaN(Number(GameState[key])));
    }

  ngOnInit() {
    this.game = new Game();
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
    const resGame$ = this.gameService.createGame(this.game);
    resGame$.subscribe( (game: Game) => {
      this.refreshGames();
      // creating group face
      const res$ = this.groupService.create(this.game.groupName, this.game.groupName + '_name');
      res$.subscribe( x => {
        this.snackBar.open('Group ' + this.game.groupName + ' created', 'Ok', {
        duration: 3000
        });
      });
      this.snackBar.open('Game Initialized', 'Ok', {
        duration: 3000
      });

    });
  }

  deleteGame(gameName = null) {
    if (gameName === null) {
      gameName = this.game.groupName;
    }
    // deleting game
    const resGame$ = this.gameService.deleteGame(gameName);
    resGame$.subscribe( (game: Game) => {
        this.game.groupName = '';
        this.refreshGames();
        // deleting face game
        const res$ = this.groupService.delete(gameName);
        res$.subscribe( x => {
        this.snackBar.open('Group ' + gameName + ' deleted', 'Ok', {
            duration: 3000
          });
        });
        this.snackBar.open('Game removed', 'Ok', {
          duration: 3000
        });
      });

  }

  changeStateGame(gameName = null, newState) {
    if (gameName === null) {
      return;
    }
    const res$ = this.gameService.switchState(gameName, newState);
    res$.subscribe(
      (res) => {
        this.snackBar.open('State updated', 'Ok', {
          duration: 3000
        });
        console.log('new state: ' + this.resolveGameState(res));
        this.refreshGames();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  resolveGameState(stateId: number) {
    switch (stateId) {
      case(GameState.REGISTER) : return 'Registering';
      case(GameState.LAUNCH) : return 'Launched';
      case(GameState.END): return 'Ended';
    }
    return '/';
  }

}
