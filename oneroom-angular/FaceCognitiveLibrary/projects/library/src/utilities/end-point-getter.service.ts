import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndPointGetterService {

  constructor() { }

  getEndPointUrl() {
    return localStorage.getItem('endpointCognitive');
  }

  getSubscriptionKey() {
    return localStorage.getItem('subscriptionKey');
  }
}
