import { TestBed } from '@angular/core/testing';

import { SessionTemplateMappingService } from './session-template-mapping.service';

describe('SessionTemplateMappingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SessionTemplateMappingService = TestBed.get(SessionTemplateMappingService);
    expect(service).toBeTruthy();
  });
});
