import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {auth, User} from 'firebase';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  user: User;

  private subscription: Subscription;

  constructor(public afAuth: AngularFireAuth) {
  }

  ngOnInit() {
    this.subscription = this.afAuth.user.subscribe(user => this.user = user);
  }

  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
