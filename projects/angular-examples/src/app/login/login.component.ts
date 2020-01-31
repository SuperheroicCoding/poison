import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Subscription} from 'rxjs';
import {AuthenticationService, AuthQuery, Profile} from '../core';
import UserCredential = firebase.auth.UserCredential;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  user: Profile;

  private subscription: Subscription;

  constructor(private authQuery: AuthQuery, private authService: AuthenticationService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.authQuery.profile$.pipe(untilDestroyed(this)).subscribe(user => this.user = user);
  }

  async login(): Promise<UserCredential> {
    return await this.authService.signIn();
  }

  async logout() {
    await this.authService.signOut();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
