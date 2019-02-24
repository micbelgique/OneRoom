import { SignalRAbstractService, SignalrMethods } from './signalr.abstract.service';

export abstract class SignalRCoreService<T extends SignalrMethods> extends SignalRAbstractService<T> {

    protected baseUrl = localStorage.getItem('endpoint').replace('/api', '');
    protected connectionTryDelay = 3000;

    constructor() {
        super();
    }

}
