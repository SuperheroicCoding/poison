import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot} from '@angular/router';
import {from, Observable, of} from 'rxjs';
import {AuthenticationService} from '../authentication.service';
import {switchMap, switchMapTo, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthenticationService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginIfNotAuthenticated();
  }

  private loginIfNotAuthenticated() {
    return this.authService.authenticated.pipe(
      tap(auth => console.log('AuthGuard', auth)),
      switchMap(isAuthenticated =>
        isAuthenticated ? of(isAuthenticated) :
          from(this.authService.signIn())
            .pipe(switchMapTo(this.authService.authenticated))
      ),
      take(1)
    );
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginIfNotAuthenticated();
  }

}
