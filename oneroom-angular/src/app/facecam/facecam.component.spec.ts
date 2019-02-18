import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacecamComponent } from './facecam.component';

describe('FacecamComponent', () => {
  let component: FacecamComponent;
  let fixture: ComponentFixture<FacecamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacecamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacecamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
