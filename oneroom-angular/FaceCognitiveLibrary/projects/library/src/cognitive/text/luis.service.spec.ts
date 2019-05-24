import { TestBed } from '@angular/core/testing';

import { LuisService } from './luis.service';

describe('LuisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LuisService = TestBed.get(LuisService);
    expect(service).toBeTruthy();
  });
});
