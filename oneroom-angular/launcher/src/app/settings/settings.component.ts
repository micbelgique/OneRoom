import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Game, GameService, HubService, GameState, ChallengeService, Challenge } from '@oneroomic/oneroomlibrary';

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

    challenges: Challenge[] = [];

    constructor(
      private toast: MatSnackBar,
      private gameService: GameService,
      private hubService: HubService,
      private challengeService: ChallengeService
      ) {}

    ngOnInit() {
      this.infoMessage = null;
      this.games = [];

      // game
      if (localStorage.getItem('gameData')) {
        this.game = JSON.parse(localStorage.getItem('gameData'));

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
        //
        if (this.game.scenario.scenarioId) {
          this.getChallenges(this.game.scenario.scenarioId);
        }

      } else {
        this.game = new Game();
        this.game.groupName = null;
        this.callCustomVisionStatus = false;
        this.callFaceStatus = false;
        localStorage.removeItem('user');
        localStorage.removeItem('teamData');
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
      this.toast.open('Endpoint mis à jour', 'Ok', {
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

      this.toast.open('Configuration mise à jour', 'Ok', {
        duration: 2000
      });
    }


    getGame() {
      const resGame$ = this.gameService.getGame(this.game.groupName);
      resGame$.subscribe( (game: Game) => {
        console.log(game);
        this.toast.open('Game fetched', 'Ok', {
          duration: 2000
        });
        this.game = game;
        localStorage.setItem('gameData', JSON.stringify(game));
        localStorage.setItem('gameId', game.gameId.toString());
        localStorage.setItem('groupName', game.groupName);

        localStorage.removeItem('user');
        localStorage.removeItem('teamData');

        if (this.game.scenario.scenarioId) {
          this.getChallenges(this.game.scenario.scenarioId);
        }

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
        this.toast.open('Appels face désactivé', 'Ok', {
          duration: 2000
        });
      } else {
        localStorage.setItem('cognitiveStatus', 'true');
        this.toast.open('Appels face activé', 'Ok', {
          duration: 2000
        });
      }
    }

     /* Update the game state to disable configuration modifications */
     refreshGameState(game: Game) {
      console.log(game);
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

    getChallenges(scenarioId: number) {
      console.log(scenarioId);
      const res$ = this.challengeService.getChallengesByScenario(scenarioId);
      res$.subscribe(
        (challenges: Challenge[]) => {
          // saves all challenges from game
          this.challenges = challenges.sort( (c1, c2) => c1.order - c2.order);
          localStorage.setItem('challengesData', JSON.stringify(challenges));
        },
          (err) => console.log(err)
      );
    }
}
