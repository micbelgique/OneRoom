import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Game, Configuration, GameService, GameState, Challenge, ChallengeService } from '@oneroomic/oneroomlibrary';
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
  displayedColumns: string[] = ['id', 'name', 'date', 'update', 'challenge', 'delete'];
  // game to add
  game: Game;
  configs: Configuration[];

  gameStates: string[];

  challengesIdBefore: number[] = [];
  challenges: Challenge[];

  constructor(
    private challengeService: ChallengeService,
    private gameService: GameService,
    private groupService: PersonGroupService,
    private snackBar: MatSnackBar) {
      this.gameStates = Object.keys(GameState).filter(key => !isNaN(Number(GameState[key])));
    }

  ngOnInit() {
    this.games = [];
    this.configs = [];
    this.game = new Game();
    this.challenges = [];
    this.refreshGames();
    this.refreshChallenges();
  }

  refreshGames() {
    this.gameService.getGames().subscribe( (games) => {
        this.games = games;
        // pick availables configs to choose from
        games.forEach( (g) => {
          this.getChallengesIdByGame(g);
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

  refreshChallenges() {
    this.challengeService.getChallenges().subscribe((challenges) => {
        this.challenges = challenges;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  updateChallengesInGames(bool: boolean, game: Game) {
    if (!bool) {
      this.addChallengesToGame( this.challenges.filter(c => game.challengesId.includes(c.challengeId)
                                && !this.challengesIdBefore.includes(c.challengeId)));
      this.removeChallengesFromGames( this.challenges.filter(c => !game.challengesId.includes(c.challengeId)
                                      && this.challengesIdBefore.includes(c.challengeId)));
    } else {
      localStorage.setItem('gameData', JSON.stringify(game));
      this.challengesIdBefore = game.challengesId;
    }
  }

  addChallengesToGame(challenges: Challenge[]) {
    if (challenges.length > 0) {
      console.log(challenges);
      this.challengeService.addChallengeToGame(challenges).subscribe(() => {
        this.snackBar.open('Challenges added', 'Ok', {
          duration: 1000
        });
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  removeChallengesFromGames(challenges: Challenge[]) {
    if (challenges.length > 0) {
      console.log(challenges);
      this.challengeService.deleteChallengeFromGame(challenges).subscribe(() => {
        this.snackBar.open('Challenges deleted', 'Ok', {
          duration: 1000
        });
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  getChallengesIdByGame(game: Game) {
    localStorage.setItem('gameData', JSON.stringify(game));
    this.challengeService.getChallengesByGame().subscribe( (challenges) => {
        game.challengesId = challenges.map(c => c.challengeId);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getChallengeTitleById(id: number): string {
    if (this.challenges.findIndex(c => c.challengeId === id) !== -1) {
      return this.challenges.find(c => c.challengeId === id).title;
    } else {
      return '';
    }
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
