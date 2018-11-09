import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {AuthUser} from './auth-user';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: Observable<AuthUser | null>;
  authenticated: Observable<boolean>;
  uid: string | number;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user = this.afAuth.user.pipe(
      tap(user => this.uid = user ? user.uid : null),
      map(user => user == null ? null : new AuthUser(user.displayName, user.photoURL))
    );
    this.authenticated = this.afAuth.authState.pipe(
      map(user => user != null)
    );
  }

  signIn() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  signOut() {
    this.router.navigate(['/']);
    return this.afAuth.auth.signOut();
  }

}
