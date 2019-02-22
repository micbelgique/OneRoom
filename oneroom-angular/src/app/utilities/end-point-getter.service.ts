import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndPointGetterService {

  constructor() { }

  getEndPointUrlWithId() {
    return localStorage.getItem('endpoint') + '/Games/' + localStorage.getItem('gameId');
  }
}
