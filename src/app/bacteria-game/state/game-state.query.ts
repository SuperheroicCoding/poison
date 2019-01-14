import {Injectable} from '@angular/core';
import {Query} from '@datorama/akita';
import {Observable} from 'rxjs';
import {bufferTime, distinctUntilChanged, filter, map, reduce, windowTime} from 'rxjs/operators';
import {GameStateStore, GameStateState, GameState} from './game-state.store';

@Injectable({providedIn: 'root'})
export class GameStateQuery extends Query<GameStateState> {

  constructor(protected store: GameStateStore) {
    super(store);
  }

  selectCurrentGameState(gameStateFilter?: GameState): Observable<GameState> {
    return this.select(store => store.currentState).pipe(
      distinctUntilChanged(),
      filter(state => gameStateFilter == null ? true : state === gameStateFilter)
    );
  }

  selectTimeDelta() {
    return this.select(store => store.timeDelta);
  }

  selectFps(): Observable<string> {
    const bufferTimeSpan = 500;
    return this.selectTimeDelta().pipe(bufferTime(bufferTimeSpan),
      filter(deltaTimesBuffered => deltaTimesBuffered != null && deltaTimesBuffered.length > 0),
      map(deltaTimesBuffered => deltaTimesBuffered.reduce((acc, deltaTime) => acc + deltaTime, 0) / deltaTimesBuffered.length),
      map(deltaTimeAcc => (1000 / deltaTimeAcc).toFixed(1))
    );
  }
}
