import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Game, GameService, LeaderboardService, TeamService } from '@oneroomic/oneroomlibrary';
import { FaceService } from '@oneroomic/facecognitivelibrary';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    // coordinator
    endPoint: string;
    refreshRate: number;
    // game
    game: Game = new Game();
    // Face
    subscriptionKey: string;
    endPointCognitive: string;
    callFaceStatus = true;
    // Custom vision
    subscriptionKeyCustomVision: string;
    endPointCustomVision: string;
    callCustomVisionStatus = true;

    constructor(
      private snackBar: MatSnackBar,
      private gameService: GameService
      ) {}

    ngOnInit() {
      // game
      this.game.groupName = '';
      if (localStorage.getItem('gameData')) {
        this.game = JSON.parse(localStorage.getItem('gameData'));
      }
      // coordinator
      this.endPoint = localStorage.getItem('endpoint');
      // refreshRate
      this.refreshRate = 3000;
      if (localStorage.getItem('refreshRate')) {
        this.refreshRate = Number(localStorage.getItem('refreshRate'));
      }
      // face
      this.endPointCognitive = localStorage.getItem('endpointCognitive');
      this.subscriptionKey = localStorage.getItem('subscriptionKey');
      this.callFaceStatus = localStorage.getItem('cognitiveStatus') === 'true' ? true : false;
    }

    saveCoordinatorSettings(): void {
      localStorage.setItem('endpoint', this.endPoint);
      this.snackBar.open('Settings updated', 'Ok', {
        duration: 2000
      });
    }

    saveFaceSettings(): void {
      localStorage.setItem('endpointCognitive', this.endPointCognitive);
      localStorage.setItem('subscriptionKey', this.subscriptionKey);
      this.snackBar.open('Settings updated', 'Ok', {
        duration: 2000
      });
    }

    saveRefreshRate() {
      if (this.refreshRate >= 1000) {
        localStorage.setItem('refreshRate', '' + this.refreshRate);
        this.snackBar.open('Refresh Rate updated', 'Ok', {
          duration: 2000
        });
      }
    }


    getGame() {
      const resGame$ = this.gameService.getGame(this.game.groupName);
      resGame$.subscribe( (game: Game) => {
        this.game = game;
        localStorage.setItem('gameData', JSON.stringify(game));
        this.snackBar.open('Game fetched', 'Ok', {
          duration: 2000
        });
        if (game.config) {
          console.log('auto Config');
          console.log(game.config);
          // face
          this.endPointCognitive = game.config.faceEndpoint;
          this.subscriptionKey = game.config.faceKey;
          this.saveFaceSettings();
          // refreshRate
          this.refreshRate = game.config.refreshRate;
          this.saveRefreshRate();
        }
      });
    }

    toggleFaceCalls() {
      const status = localStorage.getItem('cognitiveStatus');
      if (status === 'true') {
        localStorage.setItem('cognitiveStatus', 'false');
        this.snackBar.open('Calls face disabled', 'Ok', {
          duration: 2000
        });
      } else {
        localStorage.setItem('cognitiveStatus', 'true');
        this.snackBar.open('Calls face enabled', 'Ok', {
          duration: 2000
        });
      }
    }

}
