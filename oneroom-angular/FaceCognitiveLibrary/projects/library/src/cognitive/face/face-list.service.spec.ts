import { TestBed } from '@angular/core/testing';

import { FaceListService } from './face-list.service';

describe('FaceListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FaceListService = TestBed.get(FaceListService);
    expect(service).toBeTruthy();
  });
});
