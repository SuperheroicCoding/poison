import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {auth, User as FbUser,} from 'firebase';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthUser} from './auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: Observable<AuthUser | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.user = this.afAuth.user.pipe(map((user: FbUser) => user == null ? null : new AuthUser(user.displayName, user.photoURL)));
  }

  signIn() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
  }

  signOut() {
    return this.afAuth.auth.signOut();
  }

}
