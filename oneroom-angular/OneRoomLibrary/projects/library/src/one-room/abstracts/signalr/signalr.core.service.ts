import { SignalRAbstractService, SignalrMethods } from './signalr.abstract.service';
import { OnInit } from '@angular/core';

export abstract class SignalRCoreService<T extends SignalrMethods> extends SignalRAbstractService<T> implements OnInit {

    protected baseUrl = localStorage.getItem('endpoint').replace('/api', '');
    protected connectionTryDelay = 3000;

    constructor() {
        super();
    }

    ngOnInit(): void {
      this.baseUrl = localStorage.getItem('endpoint').replace('/api', '');
    }

}
