import { TestBed } from '@angular/core/testing';

import { FaceProcessService } from './face-process.service';

describe('FaceProcessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FaceProcessService = TestBed.get(FaceProcessService);
    expect(service).toBeTruthy();
  });
});
