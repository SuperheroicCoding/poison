import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Player } from './player.model';

export interface PlayerState extends EntityState<Player> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'bacteria-player' })
export class PlayerStore extends EntityStore<PlayerState, Player> {

  constructor() {
    super();
  }

}

