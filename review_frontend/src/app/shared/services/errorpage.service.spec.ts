import { TestBed } from '@angular/core/testing';

import { ErrorpageService } from './errorpage.service';

describe('ErrorpageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ErrorpageService = TestBed.get(ErrorpageService);
    expect(service).toBeTruthy();
  });
});
