import { Component, OnInit, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Game, GameService, LeaderboardService, GameState } from '@oneroomic/oneroomlibrary';
import { Router } from '@angular/router';

export enum KEY_CODE {
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  SPACE = 32
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    // coordinator
    endPoint: string;
    // current game
    game: Game;
    // all games
    games: Game[];
      // signalR
    private hubServiceSub;
    private gameSub;
    infoMessage: string;
    // Face
    callFaceStatus = true;
    // Custom vision
    callCustomVisionStatus = true;


    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
    if ( event.keyCode === KEY_CODE.UP_ARROW) {
      this.router.navigateByUrl('/lock');
    }
  }
    constructor(
      private toast: MatSnackBar,
      private gameService: GameService,
      private router: Router,
      private hubService: LeaderboardService
      ) {}

    ngOnInit() {
      this.infoMessage = null;
      this.games = [];

      // game
      if (localStorage.getItem('gameData')) {
        this.game = JSON.parse(localStorage.getItem('gameData'));

        // DISABLE CONFIG WHEN GAME LAUNCHED
        // join group signalr
        this.hubServiceSub = this.hubService.run().subscribe(
          () => this.hubService.joinGroup(this.game.gameId.toString())
        );

        // new game state
        this.gameSub = this.hubService.refreshGameState.subscribe(
        (gameId) => {
          if (gameId === this.game.gameId) {
            this.refreshGameState(this.game);
          }
        },
        (err) => {
          console.log(err);
        });

        this.refreshGameState(this.game);
      } else {
        this.game = new Game();
        this.game.groupName = null;
        this.callCustomVisionStatus = false;
        this.callFaceStatus = false;
      }
      // coordinator
      if (localStorage.getItem('endpoint')) {
        this.endPoint = localStorage.getItem('endpoint');
        this.loadGames();
      } else {
        this.endPoint = '';
      }
      if (localStorage.getItem('cognitiveStatus')) {
        this.callFaceStatus = localStorage.getItem('cognitiveStatus') === 'true' ? true : false;
      } else {
        this.callFaceStatus = false;
      }

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
      this.loadGames();
    }

    saveConfiguration() {
      // Face
      localStorage.setItem('endpointCognitive', this.game.config.faceEndpoint);
      localStorage.setItem('subscriptionKey', this.game.config.faceKey);
      // refresh rate
      if (this.game.config.refreshRate < 1000) {
        this.game.config.refreshRate = 1000;
      }

      localStorage.setItem('refreshRate', '' + this.game.config.refreshRate);

      this.toast.open('Settings updated', 'Ok', {
        duration: 2000
      });
    }


    getGame() {
      const resGame$ = this.gameService.getGame(this.game.groupName);
      resGame$.subscribe( (game: Game) => {
        localStorage.removeItem('user');
        localStorage.removeItem('teamData');
        localStorage.removeItem('gameData');
        this.game = game;
        localStorage.setItem('gameData', JSON.stringify(game));
        localStorage.setItem('gameId', game.gameId.toString());
        localStorage.setItem('groupName', game.groupName);
        this.toast.open('Game fetched', 'Ok', {
          duration: 2000
        });
        if (game.config) {
          console.log(game.config);
          this.saveConfiguration();
        }
      });
    }

    toggleFaceCalls() {
      const status = localStorage.getItem('cognitiveStatus');
      if (status === 'true') {
        localStorage.setItem('cognitiveStatus', 'false');
        this.toast.open('Calls face disabled', 'Ok', {
          duration: 2000
        });
      } else {
        localStorage.setItem('cognitiveStatus', 'true');
        this.toast.open('Calls face enabled', 'Ok', {
          duration: 2000
        });
      }
    }

     /* Update the game state to disable configuration modifications */
     refreshGameState(game: Game) {
      const res$ = this.gameService.getStateGame(game.groupName);
      res$.subscribe(
        (state) => {
          if (state === GameState.LAUNCH) {
            this.infoMessage = 'La partie est lancée, les paramètres ne peuvent plus être modifié !';
          } else {
            this.infoMessage = null;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }

}
