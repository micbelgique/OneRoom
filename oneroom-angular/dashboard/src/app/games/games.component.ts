import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Game, Configuration, GameService, GameState, ScenarioService, Scenario } from '@oneroomic/oneroomlibrary';
import { PersonGroupService } from '@oneroomic/facecognitivelibrary';

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

  constructor(
    private scenarioService: ScenarioService,
    private gameService: GameService,
    private groupService: PersonGroupService,
    private snackBar: MatSnackBar) {
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
        console.log(err);
      }
    );
  }

  refreshScenario() {
    this.scenarioService.getScenarios().subscribe((scenarios) => {
        this.scenarios = scenarios;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  setScenario(game: Game) {
    localStorage.setItem('gameData', JSON.stringify(game));
    this.scenarioService.setScenarioInGame(this.scenarios.find(s => s.scenarioId === game.scenarioId)).subscribe((scenario) => {
        game.scenario = scenario;
        this.snackBar.open('Scenario link to the game', 'Ok', {
          duration: 3000
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteScenario(game: Game) {
    localStorage.setItem('gameData', JSON.stringify(game));
    this.scenarioService.deleteScenarioFromGame().subscribe(() => {
        game.scenario = null;
        game.scenarioId = null;
        this.snackBar.open('Scenario unlink to the game', 'Ok', {
          duration: 3000
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // getGame() {
  //   const resGame$ = this.gameService.getGame(this.group);
  //   resGame$.subscribe( (game: Game) => {
  //     localStorage.setItem('gameId', game.gameId.toString());
  //     localStorage.setItem('groupName', game.groupName);
  //     this.snackBar.open('Game fetched', 'Ok', {
  //       duration: 3000
  //     });
  //   });
  // }

  createGame() {
    // set correct endpoint and key
    this.groupService.set(this.game.config.faceEndpoint, this.game.config.faceKey);
    // creating game coordinator
    const resGame$ = this.gameService.createGame(this.game);
    resGame$.subscribe( (game: Game) => {
      this.snackBar.open('Game Initialized', 'Ok', {
        duration: 3000
      });
      console.log(game);
      // creating group face
      const res$ = this.groupService.create(this.game.groupName, this.game.groupName + '_name');
      res$.subscribe( x => {
        this.game = new Game();
        this.snackBar.open('Group ' + this.game.groupName + ' created', 'Ok', {
        duration: 3000
        });
      });
      this.refreshGames();
    });
  }

  deleteGame(game: Game) {
    // set correct endpoint and key
    this.groupService.set(game.config.faceEndpoint, game.config.faceKey);
    // deleting game
    const resGame$ = this.gameService.deleteGame(game.groupName);
    resGame$.subscribe( (g: Game) => {
        this.snackBar.open('Game removed', 'Ok', {
          duration: 1000
        });
        // deleting face game
        const res$ = this.groupService.delete(game.groupName);
        res$.subscribe( x => {
          console.log(x);
          this.snackBar.open('Group ' + game.groupName + ' deleted', 'Ok', {
            duration: 1000
          });
        });
        this.refreshGames();
        this.game.groupName = '';
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

  recreateGroup(game: Game) {
    // set correct endpoint and key
    this.groupService.set(game.config.faceEndpoint, game.config.faceKey);
    // deleting face group
    const res$ = this.groupService.delete(game.groupName);
    res$.subscribe( x => {
      this.snackBar.open('Group ' + game.groupName + ' deleted', 'Ok', {
        duration: 1000
      });
      // recreating group face
      const res2$ = this.groupService.create(game.groupName, game.groupName + '_name');
      res2$.subscribe( () => {
        this.snackBar.open('Group ' + game.groupName + ' recreated', 'Ok', {
          duration: 1000
        });
      });
    });
  }

  fillConfig(existingConfig: Configuration) {
    this.game.config = new Configuration();
    this.game.config.faceEndpoint = existingConfig.faceEndpoint;
    this.game.config.faceKey = existingConfig.faceKey;
    this.game.config.minimumRecognized = existingConfig.minimumRecognized;
    this.game.config.refreshRate = existingConfig.refreshRate;
    this.game.config.visionEndpoint = existingConfig.visionEndpoint;
    this.game.config.visionKey = existingConfig.visionKey;
    this.game.config.id = 0;
    console.log(this.game.config);
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
