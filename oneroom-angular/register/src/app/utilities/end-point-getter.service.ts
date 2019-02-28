import { Injectable } from '@angular/core';
import { Game } from '../services/OnePoint/model/game';

@Injectable({
  providedIn: 'root'
})
export class EndPointGetterService {

  constructor() { }

  getEndPointUrl() {
    return localStorage.getItem('endpoint');
  }

  getEndPointUrlWithId() {
    // game
    let game: Game = new Game();
    game.groupName = '';
    if (localStorage.getItem('gameData')) {
      game = JSON.parse(localStorage.getItem('gameData'));
    } else {
      return null;
    }
    return localStorage.getItem('endpoint') + '/Games/' + game.gameId;
  }
}
