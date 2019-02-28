import { TestBed } from '@angular/core/testing';

import { Signalr.CoreService } from './signalr.core.service';

describe('Signalr.CoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Signalr.CoreService = TestBed.get(Signalr.CoreService);
    expect(service).toBeTruthy();
  });
});
