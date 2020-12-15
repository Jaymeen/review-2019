import { TestBed } from '@angular/core/testing';

import { SessionMappingService } from './session-mapping.service';

describe('SessionMappingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SessionMappingService = TestBed.get(SessionMappingService);
    expect(service).toBeTruthy();
  });
});
