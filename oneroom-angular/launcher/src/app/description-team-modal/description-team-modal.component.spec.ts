import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionTeamModalComponent } from './description-team-modal.component';

describe('DescriptionTeamModalComponent', () => {
  let component: DescriptionTeamModalComponent;
  let fixture: ComponentFixture<DescriptionTeamModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionTeamModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionTeamModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
