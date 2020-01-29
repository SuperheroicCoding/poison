import {Injectable} from '@angular/core';
import {applyTransaction} from '@datorama/akita';
import {animationFrameScheduler, interval, Observable, Subscription} from 'rxjs';
import {filter, map, pairwise, switchMapTo, takeUntil, tap, timestamp} from 'rxjs/operators';
import {HeadlineAnimationService} from '../../core/headline-animation.service';
import {GameStateQuery} from './game-state.query';
import {GameState, GameStateStore} from './game-state.store';
import {Player} from './player.model';
import {PlayerQuery} from './player.query';
import {PlayerService} from './player.service';

const FPS = 30;

@Injectable({providedIn: 'root'})
export class GameStateService {
  private gameLoop$: Observable<number>;
  private subscriptions: Subscription;

  constructor(private gameStateStore: GameStateStore,
              private gameStateQuery: GameStateQuery,
              private playerQuery: PlayerQuery,
              private headlineAnimation: HeadlineAnimationService,
              private playerService: PlayerService) {
    this.gameLoop$ = interval(1000 / FPS, animationFrameScheduler).pipe(
      timestamp(),
      pairwise(),
      map(([value1, value2]) => value2.timestamp - value1.timestamp),
    );
  }

  init(width: number, height: number) {
    this.gameStateStore.update({width, height, winner: null});
    // subscribe update time passed when game running
    const running$ = this.gameStateQuery.selectCurrentGameState(GameState.RUNNING);
    const notRunning$ = this.gameStateQuery.selectCurrentGameState().pipe(
      filter(value => value !== GameState.RUNNING));

    this.subscriptions = running$.pipe(
      switchMapTo(this.gameLoop$.pipe(
        takeUntil(
          notRunning$
        )))
    ).subscribe(timeDelta =>
        this.gameStateStore.update(state => (
          {
            timePassed: state.timePassed + timeDelta,
            timeDelta
          })),
      error => {
        console.error('error in gameLoop', error);
      }
    );
    this.subscriptions.add(
      this.gameStateQuery.selectCurrentGameState()
        .pipe(tap(x => {
          if (x === GameState.RUNNING || x === GameState.PAUSED) {
            this.headlineAnimation.stopAnimation();
          } else {
            this.headlineAnimation.startAnimation();
          }
        })).subscribe()
    );

    // subscribe determine Winner
    this.subscriptions.add(running$.pipe(
      switchMapTo(this.playerQuery.selectAll().pipe(
        takeUntil(
          this.gameStateQuery.selectCurrentGameState().pipe(
            filter(value => value !== GameState.RUNNING))
        ))),
      map(players => this.determineWinner(players)),
      filter(winner => winner != null)
    ).subscribe(winner =>
      applyTransaction(() => {
          this.gameStateStore.update({currentState: GameState.END});
          this.gameStateStore.update({winner: winner});
        }
      )));
  }

  private initPlayers() {
    const {width, height} = this.gameStateQuery.getValue();
    this.playerService.init([
      {x: width / 4, y: height / 2, color: [255, 100, 20, 255]}, {
        x: (width / 4) * 3,
        y: height / 2,
        color: [0, 100, 230, 255]
      }]);
  }

  start() {
    this.initPlayers();
    this.gameStateStore.update(state => ({currentState: GameState.RUNNING}));
  }

  reset() {
    this.gameStateStore.update(state => ({
      currentState: GameState.END,
      timePassed: 0
    }));
    this.initPlayers();
    this.gameStateStore.update(state => ({
      currentState: GameState.START,
      timePassed: 0,
      timeDelta: 1
    }));
  }

  private determineWinner(players: Player[]): Player | null {
    const hasBacteriasPlayers = players.filter(value => value.bacterias.length > 0);
    if (hasBacteriasPlayers.length === 1) {
      return players[0];
    }
    return null;
  }

  private togglePause() {
    this.gameStateStore.update(state => {
      if (state.currentState === GameState.RUNNING) {
        return {currentState: GameState.PAUSED};
      }
      if (state.currentState === GameState.PAUSED) {
        return {currentState: GameState.RUNNING};
      }
    });
  }

  addKeyPress(keyToAdd: string): void {
    if (keyToAdd.toLowerCase() === 'p') {
      this.togglePause();
      return;
    }
    this.gameStateStore.update(state => ({keysPressed: [...state.keysPressed.filter((keys) => keyToAdd !== keys), keyToAdd]}));
  }

  removeKeyPress(key: string): void {
    this.gameStateStore.update(state => ({keysPressed: [...state.keysPressed.filter((keys) => key !== keys)]}));
  }

  cleanup(): void {
    this.pause();
    this.gameStateStore.update({keysPressed: []});
    this.subscriptions?.unsubscribe();
  }

  pause() {
    this.gameStateStore.update({currentState: GameState.PAUSED});
  }
}
