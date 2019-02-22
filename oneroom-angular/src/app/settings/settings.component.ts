import { Component, OnInit } from '@angular/core';
import { PersonGroupService } from '../services/cognitive/person-group.service';
import { MatSnackBar } from '@angular/material';
import { GameService } from '../services/OnePoint/game.service';
import { Game } from '../services/OnePoint/model/game';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  // tslint:disable-next-line:variable-name
  // _endPoint = environment.Data.EndPoint;
  // tslint:disable-next-line:variable-name
  // _subscriptionKey = environment.faceApi.SubscriptionKey;
  // tslint:disable-next-line:variable-name
  // _endPointCognitive = environment.faceApi.EndPoint;

  endPoint: string;
  subscriptionKey: string;
  endPointCognitive: string;

  testResult: boolean;
  saved = true;

  group: string;

  constructor(
    private snackBar: MatSnackBar,
    private groupService: PersonGroupService,
    private gameService: GameService) {}

  ngOnInit() {
    this.group = localStorage.getItem('groupName');
    this.endPoint = localStorage.getItem('endpoint');
    this.endPointCognitive = localStorage.getItem('endpointCognitive');
    this.subscriptionKey = localStorage.getItem('subscriptionKey');
  }

  verifyEndPoint(): boolean {
    // Not implemented
    return true;
  }

  verifySub(): boolean {
    // Not implemented
    return true;
  }

  test(): void {
    this.testResult = this.verifyEndPoint() && this.verifySub();
  }

  save(): void {
    this.saved = !this.saved;
    localStorage.setItem('endpoint', this.endPoint);
    localStorage.setItem('endpointCognitive', this.endPointCognitive);
    localStorage.setItem('subscriptionKey', this.subscriptionKey);
    this.snackBar.open('Settings updated', 'Ok', {
      duration: 2000
    });
  }

  get() {
    const resGame$ = this.gameService.getGame(this.group);
    resGame$.subscribe( (game: Game) => {
      localStorage.setItem('gameId', game.gameId.toString());
      localStorage.setItem('groupName', game.groupName);
      this.snackBar.open('Game fetched', 'Ok', {
        duration: 3000
      });
    });
  }

  create() {
    const resGame$ = this.gameService.createGame(this.group);
    resGame$.subscribe( (game: Game) => {
      localStorage.setItem('gameId', game.gameId.toString());
      this.snackBar.open('Game Initialized', 'Ok', {
        duration: 3000
      });
      const res$ = this.groupService.create(this.group, this.group + ' name ');
      res$.subscribe( x => {
        localStorage.setItem('groupName', this.group);
        this.snackBar.open('Group ' + this.group + ' created', 'Ok', {
        duration: 3000
        });
      });
    });
  }

  delete() {
    const res$ = this.groupService.delete(this.group);
    res$.subscribe( x => {
      localStorage.removeItem('groupName');
      this.snackBar.open('Group ' + this.group + ' deleted', 'Ok', {
        duration: 3000
      });
      const resGame$ = this.gameService.deleteGame(this.group);
      resGame$.subscribe( (game: Game) => {
        this.group = '';
        localStorage.removeItem('gameId');
        this.snackBar.open('Game removed', 'Ok', {
          duration: 3000
        });
      });
    });
  }
}
