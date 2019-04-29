import { Component, OnInit } from '@angular/core';
import { Game, Configuration, GameService, GameState, ScenarioService, Scenario } from '@oneroomic/oneroomlibrary';
import { PersonGroupService } from '@oneroomic/facecognitivelibrary';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  // list of launched games
  games: Game[];
  // column order
  displayedColumns: string[] = ['id', 'name', 'date', 'update', 'scenario', 'delete'];
  // game to add
  game: Game;
  configs: Configuration[];

  gameStates: string[];

  scenarios: Scenario[];

  constructor(private scenarioService: ScenarioService,
              private gameService: GameService,
              private groupService: PersonGroupService,
              private notifierService: NotifierService) {
    this.gameStates = Object.keys(GameState).filter(key => !isNaN(Number(GameState[key])));
  }

  ngOnInit() {
    this.games = [];
    this.configs = [];
    this.game = new Game();
    this.scenarios = [];
    this.refreshGames();
    this.refreshScenario();
  }

  refreshGames() {
    this.gameService.getGames().subscribe( (games) => {
        this.games = games;
        // pick availables configs to choose from
        games.forEach( (g) => {
          if (g.scenario !== null) {
            g.scenarioId = g.scenario.scenarioId;
          }
          if (g.config.faceEndpoint && g.config.faceKey) {
            if (this.configs.map(c => c.id).indexOf(g.config.id) === -1) {
              this.configs.push(g.config);
            }
          }
        });
      },
      (err) => {
        this.notifierService.notify( 'error', err.error );
      }
    );
  }

  refreshScenario() {
    this.scenarioService.getScenarios().subscribe( (scenarios) => {
        this.scenarios = scenarios;
      },
      (err) => {
        this.notifierService.notify( 'error', err.error );
      }
    );
  }

  setScenario(game: Game) {
    localStorage.setItem('gameData', JSON.stringify(game));
    this.scenarioService.setScenarioInGame(this.scenarios.find(s => s.scenarioId === game.scenarioId)).subscribe((scenario) => {
        game.scenario = scenario;
        this.notifierService.notify( 'success', 'Scenario link to the game' );
      },
      (err) => {
        this.notifierService.notify( 'error', err.error );
      }
    );
  }

  deleteScenario(game: Game) {
    localStorage.setItem('gameData', JSON.stringify(game));
    this.scenarioService.deleteScenarioFromGame().subscribe(() => {
        game.scenario = null;
        game.scenarioId = null;
        this.notifierService.notify( 'warning', 'Scenario unlink to the game' );
      },
      (err) => {
        this.notifierService.notify( 'error', err.error );
      }
    );
  }

  createGame() {
    // set correct endpoint and key
    this.groupService.set(this.game.config.faceEndpoint, this.game.config.faceKey);
    // creating game coordinator
    this.gameService.createGame(this.game).subscribe( () => {
        this.notifierService.notify( 'success', 'Game Initialized' );
        // creating group face
        this.groupService.create(this.game.groupName, this.game.groupName + '_name').subscribe( () => {
            this.game = new Game();
            this.notifierService.notify( 'success', 'Group ' + this.game.groupName + ' created' );
          },
          (err) => {
            this.notifierService.notify( 'error', err.error );
          }
        );
        this.refreshGames();
      },
      (err) => {
        this.notifierService.notify( 'error', err.error.title ? err.error.title : err.error );
      }
    );
  }

  deleteGame(game: Game) {
    // set correct endpoint and key
    this.groupService.set(game.config.faceEndpoint, game.config.faceKey);
    // deleting game
    this.gameService.deleteGame(game.groupName).subscribe( () => {
        this.notifierService.notify( 'warning', 'Group  removed');
        // deleting face game
        this.groupService.delete(game.groupName).subscribe( () => {
            this.notifierService.notify( 'warning', 'Group ' + game.groupName + ' deleted');
          },
          (err) => {
            this.notifierService.notify( 'error', err.error );
          }
        );
        this.refreshGames();
        this.game.groupName = '';
      },
      (err) => {
        this.notifierService.notify( 'error', err.error );
      }
    );
  }

  changeStateGame(gameName = null, newState) {
    if (gameName === null) {
      return;
    }
    this.gameService.switchState(gameName, newState).subscribe( () => {
        this.notifierService.notify( 'success', 'State updated');
        this.refreshGames();
      },
      (err) => {
        this.notifierService.notify( 'error', err.error );
      }
    );
  }

  recreateGroup(game: Game) {
    // set correct endpoint and key
    this.groupService.set(game.config.faceEndpoint, game.config.faceKey);
    // deleting face group
    this.groupService.delete(game.groupName).subscribe( () => {
        this.notifierService.notify( 'warning', 'Group ' + game.groupName + ' deleted');
        // recreating group face
        this.groupService.create(game.groupName, game.groupName + '_name').subscribe( () => {
            this.notifierService.notify( 'success', 'Group ' + this.game.groupName + ' created' );
          },
          (err) => {
            this.notifierService.notify( 'error', err.error );
          }
        );
      },
      (err) => {
        this.notifierService.notify( 'error', err.statusText );
      }
    );
  }

  fillConfig(existingConfig: Configuration) {
    this.game.config = new Configuration();
    this.game.config.faceEndpoint = existingConfig.faceEndpoint;
    this.game.config.faceKey = existingConfig.faceKey;
    this.game.config.minimumRecognized = existingConfig.minimumRecognized;
    this.game.config.visionEndpoint = existingConfig.visionEndpoint;
    this.game.config.visionKey = existingConfig.visionKey;
    this.game.config.visionEndpointSkinColor = existingConfig.visionEndpointSkinColor;
    this.game.config.visionKeySkinColor = existingConfig.visionKeySkinColor;
    this.game.config.refreshRate = existingConfig.refreshRate;
    this.game.config.id = 0;
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
