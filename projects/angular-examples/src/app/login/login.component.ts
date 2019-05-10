import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../core/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {AuthUser} from '../core/auth-user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  user: AuthUser;

  private subscription: Subscription;

  constructor(public authenticationService: AuthenticationService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.subscription = this.authenticationService.user.subscribe(user => this.user = user);
  }

  login() {
    this.authenticationService.signIn().catch(error => {
      console.log('Error sign in: ', error);
      const matSnackBarRef = this.snackBar.open('Upps, there was an error while signing in. Try again later.',
        'Retry now!', {
          duration: 6000, horizontalPosition: 'right', verticalPosition: 'top'
        });
      matSnackBarRef.onAction().subscribe(() => this.login());
    });
  }

  logout() {
    this.authenticationService.signOut()
      .catch(error => {
        console.log('Error sign out: ', error);
        this.snackBar.open('Error signing out', null, {
          duration: 6000, horizontalPosition: 'right', verticalPosition: 'top'
        });
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
