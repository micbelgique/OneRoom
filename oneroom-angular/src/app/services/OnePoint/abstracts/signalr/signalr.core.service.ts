import { SignalRAbstractService, SignalrMethods } from './signalr.abstract.service';
import { HttpClient } from '@angular/common/http';

export const loginTokenKey = 'devDaysToken';

export abstract class SignalRCoreService<T extends SignalrMethods> extends SignalRAbstractService<T> {

    protected baseUrl = localStorage.getItem('endpoint').replace('/api', '');
    protected connectionTryDelay = 3000;

    constructor() {
        super();
    }

}
