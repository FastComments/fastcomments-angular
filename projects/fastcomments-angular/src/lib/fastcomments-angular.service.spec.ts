import { TestBed } from '@angular/core/testing';

import { FastcommentsAngularService } from './fastcomments-angular.service';

describe('FastcommentsAngularService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FastcommentsAngularService = TestBed.get(FastcommentsAngularService);
    expect(service).toBeTruthy();
  });
});
