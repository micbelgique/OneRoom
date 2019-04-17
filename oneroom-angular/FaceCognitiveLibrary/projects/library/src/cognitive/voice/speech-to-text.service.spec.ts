import { TestBed } from '@angular/core/testing';

import { SpeechToTextService } from './speech-to-text.service';

describe('SpeechToTextService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpeechToTextService = TestBed.get(SpeechToTextService);
    expect(service).toBeTruthy();
  });
});
