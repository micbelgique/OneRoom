import { SignalRAbstractService, SignalrMethods } from './signalr.abstract.service';

export abstract class SignalRCoreService<T extends SignalrMethods> extends SignalRAbstractService<T> {

    protected baseUrl;
    protected connectionTryDelay = 3000;

    constructor() {
        super();
        if (localStorage.getItem('endpoint')) {
          this.baseUrl = localStorage.getItem('endpoint').replace('/api', '');
        }
    }

}
