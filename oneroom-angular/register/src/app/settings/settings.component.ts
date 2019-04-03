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
  game: Game;
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
    private hubService: LeaderboardService) {
      this.hubServiceSub = this.hubService.run().subscribe();
    }

  ngOnInit() {
    // init vars
    this.games = [];
    // game
    if (localStorage.getItem('gameData')) {
      this.game = JSON.parse(localStorage.getItem('gameData'));
    } else {
      this.game = new Game();
      this.game.groupName = null;
    }
    // coordinator
    if (localStorage.getItem('endpoint')) {
      this.endPoint = localStorage.getItem('endpoint');
      // load available games from coordinator
      this.loadGames();
    } else {
      this.endPoint = '';
    }

    // refreshRate
    if (localStorage.getItem('refreshRate')) {
      this.refreshRate = Number(localStorage.getItem('refreshRate'));
    } else {
      this.refreshRate = 2500;
    }

    // Face config

    if (localStorage.getItem('endpointCognitive')) {
      this.endPointCognitive = localStorage.getItem('endpointCognitive');
    } else {
      this.endPointCognitive = '';
    }

    if (localStorage.getItem('subscriptionKey')) {
      this.subscriptionKey = localStorage.getItem('subscriptionKey');
    } else {
      this.subscriptionKey = '';
    }

    if (localStorage.getItem('cognitiveStatus')) {
      this.callFaceStatus = localStorage.getItem('cognitiveStatus') === 'true' ? true : false;
    } else {
      this.callFaceStatus = false;
    }

    // custom vision
    if (localStorage.getItem('subscriptionKeyCustomVision')) {
      this.subscriptionKeyCustomVision = localStorage.getItem('subscriptionKeyCustomVision');
    } else {
      this.subscriptionKeyCustomVision = '';
    }

    if (localStorage.getItem('endPointCustomVision')) {
      this.endPointCustomVision = localStorage.getItem('endPointCustomVision');
    } else {
      this.endPointCustomVision = '';
    }

    if (localStorage.getItem('customVisionStatus')) {
      this.callCustomVisionStatus = localStorage.getItem('customVisionStatus') === 'true' ? true : false;
    } else {
      this.callCustomVisionStatus = false;
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
