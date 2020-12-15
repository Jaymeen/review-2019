import { TestBed } from '@angular/core/testing';

import { RevieweeListService } from './reviewee-list.service';

describe('RevieweeListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RevieweeListService = TestBed.get(RevieweeListService);
    expect(service).toBeTruthy();
  });
});
