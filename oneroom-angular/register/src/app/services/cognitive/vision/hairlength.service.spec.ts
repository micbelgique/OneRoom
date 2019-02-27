import { TestBed } from '@angular/core/testing';

import { HairlengthService } from './hairlength.service';

describe('HairlengthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HairlengthService = TestBed.get(HairlengthService);
    expect(service).toBeTruthy();
  });
});
