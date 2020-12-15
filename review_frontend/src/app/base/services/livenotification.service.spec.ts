import { TestBed } from '@angular/core/testing';

import { LivenotificationService } from './livenotification.service';

describe('LivenotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LivenotificationService = TestBed.get(LivenotificationService);
    expect(service).toBeTruthy();
  });
});
