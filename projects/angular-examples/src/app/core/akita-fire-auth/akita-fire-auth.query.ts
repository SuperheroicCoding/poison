import {Injectable} from '@angular/core';
import {Query, StoreConfig} from '@datorama/akita';
import {Observable} from 'rxjs';
import {AkitaAuthState, AkitaAuthStore} from './akita-fire-auth.store';
import {map} from 'rxjs/operators';
import {Profile} from './profile';

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'akita-auth-store'})
export class AkitaAuthQuery extends Query<AkitaAuthState> {

  profile$: Observable<Profile> = this.select('profile');
  authenticated$ = this.select().pipe(
    map(state => state.uid != null)
  );

  get profile(): Profile {
    return this.getValue().profile;
  }

  get authenticated(): boolean {
    return (this.getValue().uid != null);
  }

  constructor(store: AkitaAuthStore) {
    super(store);
  }

}
