import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Game, GameService, LeaderboardService } from '@oneroomic/oneroomlibrary';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  // coordinator
  endPoint: string;

  // current game
  game: Game;

  // other games
  games: Game[];

  // status
  callFaceStatus = true;
  callCustomVisionStatus = true;

  // connection hub
  private hubServiceSub;

  constructor(
    private toast: MatSnackBar,
    private gameService: GameService,
    private hubService: LeaderboardService) {
    }

  ngOnInit() {

    // init vars

    this.games = [];

    // coordinator

    if (localStorage.getItem('endpoint')) {
      this.endPoint = localStorage.getItem('endpoint');
      // load available games from coordinator
      this.loadGames();
    } else {
      this.endPoint = '';
    }

    // enable / disable custom vision

    if (localStorage.getItem('customVisionStatus')) {
      this.callCustomVisionStatus = localStorage.getItem('customVisionStatus') === 'true' ? true : false;
    } else {
      this.callCustomVisionStatus = false;
    }

    // enable / disable face

    if (localStorage.getItem('cognitiveStatus')) {
      this.callFaceStatus = localStorage.getItem('cognitiveStatus') === 'true' ? true : false;
    } else {
      this.callFaceStatus = false;
    }

    // game

    if (localStorage.getItem('gameData')) {
      this.game = JSON.parse(localStorage.getItem('gameData'));
    } else {
      this.game = new Game();
      this.callCustomVisionStatus = false;
      this.callFaceStatus = false;
      this.game.groupName = null;
    }

    this.hubServiceSub = this.hubService.run().subscribe();
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
    const resGame$ = this.gameService.getGame(this.game.groupName);
    resGame$.subscribe( (game: Game) => {
      // leave old group
      if (this.game.gameId !== undefined && this.game.gameId !== null && this.hubService.connected) {
        this.hubService.leaveGroup(this.game.gameId.toString());
      }
      this.game = game;
      // localStorage.setItem('gameData', JSON.stringify(game));
      this.toast.open('Game fetched', 'Ok', {
        duration: 2000
      });
      // join new group
      this.hubService.joinGroup(this.game.gameId.toString());
      if (game.config) {
        console.log('Config detected');
        this.saveConfiguration();
      } else {
        console.log('No Config');
      }
    });
  }

  saveConfiguration() {
    localStorage.setItem('gameData', JSON.stringify(this.game));
    // saving face settings
    localStorage.setItem('endpointCognitive', this.game.config.faceEndpoint);
    localStorage.setItem('subscriptionKey', this.game.config.faceKey);
    // saving refresh rate
    localStorage.setItem('refreshRate', this.game.config.refreshRate + '');
    // saving custom vision
    // hairlength
    localStorage.setItem('endPointCustomVision', this.game.config.visionEndpoint);
    localStorage.setItem('subscriptionKeyCustomVision', this.game.config.visionKey);
    // skincolor
    localStorage.setItem('subscriptionKeyCustomVisionSkinColor', this.game.config.visionEndpointSkinColor);
    localStorage.setItem('endPointCustomVisionSkinColor', this.game.config.visionKeySkinColor);
    this.toast.open('Configuration sauvée', 'Ok', {
        duration: 2000
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

  toggleCustomVisionCalls() {
    const status = localStorage.getItem('customVisionStatus');
    if (status === 'true') {
      localStorage.setItem('customVisionStatus', 'false');
      this.toast.open('Calls custom vision disabled', 'Ok', {
        duration: 2000
      });
    } else {
      localStorage.setItem('customVisionStatus', 'true');
      this.toast.open('Calls custom vision enabled', 'Ok', {
        duration: 2000
      });
    }
  }

  ngOnDestroy(): void {
    if (this.hubServiceSub) {
      this.hubServiceSub.unsubscribe();
    }
  }

}
