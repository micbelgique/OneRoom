import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndPointGetterService {

  constructor() { }

  getFaceEndPointUrl() {
    return localStorage.getItem('endpointCognitive');
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
