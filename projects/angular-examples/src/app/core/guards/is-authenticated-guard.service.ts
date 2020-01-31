import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot} from '@angular/router';
import {from, Observable, of} from 'rxjs';
import {distinctUntilChanged, switchMap, switchMapTo, take, tap} from 'rxjs/operators';
import {AuthenticationService, AuthQuery} from '../index';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivate, CanLoad {

  constructor(private authQuery: AuthQuery, private authService: AuthenticationService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginIfNotAuthenticated();
  }

  private loginIfNotAuthenticated() {
    return this.authQuery.authenticated$.pipe(
      take(1),
      switchMap(isAuthenticated =>
        isAuthenticated ? of(isAuthenticated) :
          from(this.authService.signIn().then(() => true, error => false))
      )
    );
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginIfNotAuthenticated();
  }

}
