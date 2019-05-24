import { TestBed } from '@angular/core/testing';

import { CustomVisionPredictionService } from './custom-vision-prediction.service';

describe('CustomVisionPredictionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomVisionPredictionService = TestBed.get(CustomVisionPredictionService);
    expect(service).toBeTruthy();
  });
});
