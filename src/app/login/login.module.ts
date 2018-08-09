import {NgModule} from '@angular/core';
import {LoginComponent} from './login.component';
import {SharedModule} from '../shared/shared.module';
import {AngularFireAuthModule} from 'angularfire2/auth';

@NgModule({
  imports: [
    SharedModule,
    AngularFireAuthModule,
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class LoginModule {
}
