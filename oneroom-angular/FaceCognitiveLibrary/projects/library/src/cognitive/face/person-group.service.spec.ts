import { TestBed } from '@angular/core/testing';

import { PersonGroupService } from './person-group.service';

describe('PersonGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersonGroupService = TestBed.get(PersonGroupService);
    expect(service).toBeTruthy();
  });
});
