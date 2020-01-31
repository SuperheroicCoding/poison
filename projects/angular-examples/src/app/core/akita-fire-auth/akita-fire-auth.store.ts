import {Injectable} from '@angular/core';
import {Store, StoreConfig} from '@datorama/akita';
import {FireAuthState, initialAuthState} from 'akita-ng-fire';
import {Profile} from './profile';

export interface AkitaAuthState extends FireAuthState<Profile> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth' })
export class AkitaAuthStore extends Store<AkitaAuthState> {
  constructor() {
    super(initialAuthState);
  }
}
