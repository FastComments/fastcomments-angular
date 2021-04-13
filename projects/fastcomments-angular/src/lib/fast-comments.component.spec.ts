import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastCommentsComponent } from './fast-comments.component';

describe('FastCommentsAngularComponent', () => {
  let component: FastCommentsComponent;
  let fixture: ComponentFixture<FastCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
