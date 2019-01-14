import {Injectable} from '@angular/core';
import {Store, StoreConfig} from '@datorama/akita';

export enum GameState {
  RUNNING,
  PAUSED,
  END,
  START
}


export interface GameStateState {
  currentState: GameState;
  timePassed: number;
  timeDelta: number;
  width: number;
  height: number;
}


export function createInitialState(): GameStateState {
  return {
    currentState: GameState.START,
    timePassed: 1,
    timeDelta: 1,
    width: 480,
    height: 320
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'game-state'})
export class GameStateStore extends Store<GameStateState> {

  constructor() {
    super(createInitialState());
  }

}

