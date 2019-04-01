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
  refreshRate: number;
  // game
  game: Game = new Game();
  games: Game[];
  // Face
  subscriptionKey: string;
  endPointCognitive: string;
  callFaceStatus = true;
  // Custom vision
  subscriptionKeyCustomVision: string;
  endPointCustomVision: string;
  callCustomVisionStatus = true;

  private hubServiceSub;

  constructor(
    private toast: MatSnackBar,
    private gameService: GameService,
    private hubService: LeaderboardService) {}

  ngOnInit() {
    // game
    this.game.groupName = null;
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
    // custom vision
    this.subscriptionKeyCustomVision = localStorage.getItem('subscriptionKeyCustomVision');
    this.endPointCustomVision = localStorage.getItem('endPointCustomVision');
    this.callCustomVisionStatus = localStorage.getItem('customVisionStatus') === 'true' ? true : false;
    // load available games from coordinator
    this.games = [];
    this.loadGames();
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

  saveFaceSettings(): void {
    localStorage.setItem('endpointCognitive', this.endPointCognitive);
    localStorage.setItem('subscriptionKey', this.subscriptionKey);
    this.toast.open('Settings updated', 'Ok', {
      duration: 2000
    });
  }

  saveRefreshRate() {
    if (this.refreshRate >= 1000) {
      localStorage.setItem('refreshRate', '' + this.refreshRate);
      this.toast.open('Refresh Rate updated', 'Ok', {
        duration: 2000
      });
    }
  }


  getGame() {
    const resGame$ = this.gameService.getGame(this.game.groupName);
    resGame$.subscribe( (game: Game) => {
      // leave old group
      if (this.game.groupName !== null && this.hubService.connected) {
        this.hubService.leaveGroup(this.game.gameId.toString());
      }
      this.game = game;
      localStorage.setItem('gameData', JSON.stringify(game));
      this.toast.open('Game fetched', 'Ok', {
        duration: 2000
      });
      // join new group
      this.hubService.joinGroup(this.game.gameId.toString());
      if (game.config) {
        console.log('auto Config');
        console.log(game.config);
        // face
        this.endPointCognitive = game.config.faceEndpoint;
        this.subscriptionKey = game.config.faceKey;
        this.saveFaceSettings();
        // custom vision
        this.endPointCustomVision  = game.config.visionEndpoint;
        this.subscriptionKeyCustomVision = game.config.visionKey;
        this.saveCustomVisionSettings();
        // refreshRate
        this.refreshRate = game.config.refreshRate;
        this.saveRefreshRate();
      }
    });
  }

  saveCustomVisionSettings(): void {
    localStorage.setItem('endPointCustomVision', this.endPointCustomVision);
    localStorage.setItem('subscriptionKeyCustomVision', this.subscriptionKeyCustomVision);
    this.toast.open('Settings updated', 'Ok', {
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
