import { TestBed } from '@angular/core/testing';

import { GetUserRoleService } from './get-user-role.service';

describe('GetUserRoleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetUserRoleService = TestBed.get(GetUserRoleService);
    expect(service).toBeTruthy();
  });
});
