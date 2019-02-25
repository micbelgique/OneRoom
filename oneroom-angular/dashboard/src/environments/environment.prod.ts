export const environment = {
  production: true,
  faceApi: {
    SubscriptionKey : localStorage.getItem('subscriptionKey'),
    EndPoint : localStorage.getItem('endpointCognitive'),
  },
  Data: {
    EndPoint : localStorage.getItem('endpoint')
  }
};
