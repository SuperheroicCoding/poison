import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {auth, User as FbUser,} from 'firebase';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthUser} from './auth-user';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: Observable<AuthUser | null>;
  authenticated: Observable<boolean>;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user = this.afAuth.user.pipe(
      map((user: FbUser) => user == null ? null : new AuthUser(user.displayName, user.photoURL))
    );
    this.authenticated = this.afAuth.authState.pipe(
      map(user => user != null)
    );
  }

  signIn() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
  }

  signOut() {
    this.router.navigate(['/']);
    return this.afAuth.auth.signOut();
  }

}
