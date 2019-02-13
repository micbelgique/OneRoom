import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CamcardComponent } from './camcard.component';

describe('CamcardComponent', () => {
  let component: CamcardComponent;
  let fixture: ComponentFixture<CamcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CamcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
