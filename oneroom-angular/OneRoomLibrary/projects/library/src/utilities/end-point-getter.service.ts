import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndPointGetterService {

  constructor() { }

  getEndPointUrl() {
    if (localStorage.getItem('endpoint')) {
      return localStorage.getItem('endpoint');
    } else {
      throw new Error('No endpoint configured');
    }
  }

  getEndPointUrlWithId() {
    if (localStorage.getItem('endpoint') && localStorage.getItem('gameData')) {
      return localStorage.getItem('endpoint') + '/Games/' + JSON.parse(localStorage.getItem('gameData')).gameId;
    } else {
      throw new Error('No endpoint or game configured');
    }
  }
}
