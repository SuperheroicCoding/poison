import {Injectable} from '@angular/core';
import {CollectionConfig, FireAuthService} from 'akita-ng-fire';
import firebase, {User} from 'firebase';
import {AkitaAuthState, AkitaAuthStore} from './akita-fire-auth.store';
import UserCredential = firebase.auth.UserCredential;

@Injectable({providedIn: 'root'})
@CollectionConfig({path: 'users'})
export class AkitaFireAuthService extends FireAuthService<AkitaAuthState> {

  constructor(store: AkitaAuthStore) {
    super(store);
  }

  protected createProfile({displayName, email, photoURL, uid}: User, ctx?: any): AkitaAuthState['profile'] {
    return {uid: uid, email: email, displayName: displayName, photoURL: photoURL};
  }

  protected async onSignin(userCredential: UserCredential): Promise<void> {
    console.log('onSignin');
    await this.update(this.createProfile(userCredential.user));
  }


}
