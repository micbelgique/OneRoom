import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { GameService, Game, Challenge, ChallengeService } from '@oneroomic/oneroomlibrary';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  // coordinator
  endPoint: string;

  // available games
  games: Game[];

  // current game
  game: Game;

  challenges: Challenge[];

  constructor(
    private toast: MatSnackBar,
    private gameService: GameService,
    private challengeService: ChallengeService) {}

  ngOnInit() {
    this.games = [];
    this.game = new Game();

    if (localStorage.getItem('gameData')) {
      this.game = JSON.parse(localStorage.getItem('gameData'));
      this.getGame(this.game.groupName);
    } else {
      this.game = new Game();
      this.game.groupName = null;
    }

    if (localStorage.getItem('endpoint')) {
      this.endPoint = localStorage.getItem('endpoint');
      // load available games from coordinator
      this.loadGames();
    } else {
      this.endPoint = '';
    }
    if (this.game.scenario.scenarioId) {
      this.getChallenges(this.game.scenario.scenarioId);
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

  getGame(groupName: string) {
    this.gameService.getGame(groupName).subscribe( (game: Game) => {
      this.game = game;
      localStorage.setItem('gameData', JSON.stringify(game));
      this.toast.open('Game fetched', 'Ok', {
        duration: 3000
      });
      this.getChallenges(game.scenario.scenarioId);
    });
  }
  getChallenges(scenarioId: number) {
    console.log(scenarioId);
    const res$ = this.challengeService.getChallengesByScenario(scenarioId);
    res$.subscribe(
      (challenges: Challenge[]) => {
        // saves all challenges from game
        this.challenges = challenges;
        localStorage.setItem('challengesData', JSON.stringify(challenges));
        this.toast.open('Challenges configurés', 'Ok', {
          duration: 2000
        });
        console.log(challenges);
      },
      (err) => console.log(err)
    );
  }

}
