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

  // coordinator
  endPoint: string;
  group: string;

  constructor(
    private snackBar: MatSnackBar,
    private groupService: PersonGroupService,
    private gameService: GameService) {}

  ngOnInit() {
    // group face
    this.group = localStorage.getItem('groupName');
    // coordinator
    this.endPoint = localStorage.getItem('endpoint');
  }

  saveCoordinatorSettings(): void {
    localStorage.setItem('endpoint', this.endPoint);
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
