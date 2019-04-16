import { TestBed } from '@angular/core/testing';

import { PersonGroupPersonService } from './person-group-person.service';

describe('PersonGroupPersonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersonGroupPersonService = TestBed.get(PersonGroupPersonService);
    expect(service).toBeTruthy();
  });
});
