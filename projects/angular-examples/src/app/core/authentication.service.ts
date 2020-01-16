import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {Angulartics2} from 'angulartics2';
import * as firebase from 'firebase';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {AuthUser} from './auth-user';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import UserCredential = firebase.auth.UserCredential;


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: Observable<AuthUser | null>;
  authenticated: Observable<boolean>;
  uid: string | number;

  constructor(private afAuth: AngularFireAuth, private router: Router, angulartics: Angulartics2) {
    this.user = this.afAuth.user.pipe(
      tap(user => {
        this.uid = user != null ? user.uid : null;
      }),
      tap(user => angulartics.setUsername.next(('' + this.uid))),
      map(user => user == null ? null : new AuthUser(user.displayName, user.photoURL))
    );
    // @ts-ignore
    this.authenticated = this.afAuth.authState.pipe(
      map(user => user != null)
    );
  }

  signIn(): Promise<UserCredential> {
    return this.afAuth.auth.signInWithPopup(new GoogleAuthProvider());
  }

  async signOut(): Promise<void> {
    await this.router.navigate(['/']);
    return this.afAuth.auth.signOut();
  }
}
