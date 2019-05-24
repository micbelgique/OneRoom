import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChangeNameComponent } from './modal-change-name.component';

describe('ModalChangeNameComponent', () => {
  let component: ModalChangeNameComponent;
  let fixture: ComponentFixture<ModalChangeNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalChangeNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalChangeNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
