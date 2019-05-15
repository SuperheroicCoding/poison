import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {Angulartics2} from 'angulartics2';
import * as firebase from 'firebase';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {AuthUser} from './auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: Observable<AuthUser | null>;
  authenticated: Observable<boolean>;
  uid: string | number;

  constructor(private afAuth: AngularFireAuth, private router: Router, angulartics: Angulartics2) {
    this.user = ((this.afAuth.user) as unknown as Observable<firebase.User>).pipe(
      tap((user: firebase.User) => {
        if (user != null) {
          this.uid = user.uid;
        } else {
          this.uid = null;
        }
      }),
      tap(user => angulartics.setUsername.next(('' + this.uid))),
      map(user => user == null ? null : new AuthUser(user.displayName, user.photoURL))
    );
    // @ts-ignore
    this.authenticated = (this.afAuth.authState as unknown as Observable<firebase.User>).pipe(
      map(user => user != null)
    );
  }

  signIn() {
    return firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  signOut() {
    this.router.navigate(['/']);
    return this.afAuth.auth.signOut();
  }
}
