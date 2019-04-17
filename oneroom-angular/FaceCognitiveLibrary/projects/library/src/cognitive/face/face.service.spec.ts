import { TestBed } from '@angular/core/testing';

import { FaceService } from './face.service';

describe('FaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FaceService = TestBed.get(FaceService);
    expect(service).toBeTruthy();
  });
});
