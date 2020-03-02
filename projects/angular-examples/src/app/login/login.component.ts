import {Component, OnDestroy, OnInit} from '@angular/core';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {AuthenticationService, AuthQuery, Profile} from '../core';
import UserCredential = firebase.auth.UserCredential;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  user: Profile;

  constructor(private authQuery: AuthQuery, private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.authQuery.profile$.pipe(untilDestroyed(this)).subscribe(user => this.user = user);
  }

  async login(): Promise<UserCredential> {
    return await this.authService.signIn();
  }

  async logout(): Promise<void> {
    await this.authService.signOut();
  }

  ngOnDestroy(): void {
  }

}
