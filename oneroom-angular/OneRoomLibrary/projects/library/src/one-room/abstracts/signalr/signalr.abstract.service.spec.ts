import { TestBed } from '@angular/core/testing';

import { Signalr.AbstractService } from './signalr.abstract.service';

describe('Signalr.AbstractService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Signalr.AbstractService = TestBed.get(Signalr.AbstractService);
    expect(service).toBeTruthy();
  });
});
