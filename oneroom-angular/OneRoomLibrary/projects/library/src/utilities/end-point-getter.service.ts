import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndPointGetterService {

  constructor() { }

  getEndPointUrl() {
    return localStorage.getItem('endpoint');
  }

  getEndPointUrlWithId() {
    return localStorage.getItem('endpoint') + '/Games/' + JSON.parse(localStorage.getItem('gameData')).gameId;
  }
}
