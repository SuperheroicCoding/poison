import { TestBed, async, inject } from '@angular/core/testing';
import {AngularFireModule} from '@angular/fire';
import {RouterTestingModule} from '@angular/router/testing';
import {Angulartics2RouterlessModule} from 'angulartics2/routerlessmodule';
import {AuthenticationService} from '../authentication.service';

import { IsAuthenticatedGuard } from './is-authenticated-guard.service';

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
