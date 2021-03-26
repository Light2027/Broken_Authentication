import { TestBed } from '@angular/core/testing';

import { AuthNegatorGuard } from './auth-negator.guard';

describe('AuthNegatorGuard', () => {
  let guard: AuthNegatorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthNegatorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
