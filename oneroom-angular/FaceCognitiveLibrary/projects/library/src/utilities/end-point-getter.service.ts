import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndPointGetterService {

  constructor() { }

  getFaceEndPointUrl() {
    return localStorage.getItem('endpointCognitive');
  }

  getEndPointUrlWithId() {
    // game
    let game;
    if (localStorage.getItem('gameData')) {
      game = JSON.parse(localStorage.getItem('gameData'));
    } else {
      return null;
    }
    return localStorage.getItem('endpoint') + '/Games/' + game.gameId;
  }

  getFaceSubscriptionKey() {
    return localStorage.getItem('subscriptionKey');
  }

  getVisionPredictionEndPoint() {
    return localStorage.getItem('endpointVisionPrediction');
  }

  getVisionTrainingEndPoint() {
    return localStorage.getItem('endpointVisionTraining');
  }

  getVisionPredictionKey() {
    return localStorage.getItem('keyVisionPrediction');
  }

  getVisionTrainingKey() {
    return localStorage.getItem('keyVisionTraining');
  }

  getHairLenghtPredictionEndPoint() {
    return localStorage.getItem('endpointHairLengthPrediction');
  }

  getHairLengthTrainingEndPoint() {
    return localStorage.getItem('endpointHairLengthTraining');
  }

  getHairLengthPredictionKey() {
    return localStorage.getItem('keyHairLengthPrediction');
  }

  getHairLengthTrainingKey() {
    return localStorage.getItem('keyHairLengthTraining');
  }

  getHairLengthProjectID() {
    return localStorage.getItem('projectIdHairLength');
  }

}
