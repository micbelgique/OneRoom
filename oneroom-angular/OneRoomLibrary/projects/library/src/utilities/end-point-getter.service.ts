import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndPointGetterService {

  constructor() { }

  getEndPointUrl() {
    if (localStorage.getItem('endpoint')) {
      return localStorage.getItem('endpoint');
    }
  }

  getEndPointUrlWithId() {
    if (localStorage.getItem('gameData')) {
      return localStorage.getItem('endpoint') + '/Games/' + JSON.parse(localStorage.getItem('gameData')).gameId;
    }
  }
}
