import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastcommentsAngularComponent } from './fastcomments-angular.component';

describe('FastcommentsAngularComponent', () => {
  let component: FastcommentsAngularComponent;
  let fixture: ComponentFixture<FastcommentsAngularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastcommentsAngularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastcommentsAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
