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
}
