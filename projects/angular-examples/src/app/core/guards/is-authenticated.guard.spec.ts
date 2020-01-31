import {inject, TestBed} from '@angular/core/testing';
import {AuthenticationService} from '../authentication.service';

import {IsAuthenticatedGuard} from './is-authenticated-guard.service';

describe('IsAuthenticatedGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsAuthenticatedGuard, {provide: AuthenticationService, useValue: {}}]
    });
  });

  it('should ...', inject([IsAuthenticatedGuard], (guard: IsAuthenticatedGuard) => {
    expect(guard).toBeTruthy();
  }));

});
