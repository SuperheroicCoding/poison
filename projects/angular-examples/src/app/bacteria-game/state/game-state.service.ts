import {Injectable} from '@angular/core';
import {applyTransaction} from '@datorama/akita';
import {animationFrameScheduler, interval, Observable} from 'rxjs';
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

    // subscribe update time passed when game running
    this.gameStateQuery.selectCurrentGameState(GameState.RUNNING).pipe(
      tap(x => this.headlineAnimation.stopAnimation()),
      switchMapTo(this.gameLoop$.pipe(
        takeUntil(
          this.gameStateQuery.selectCurrentGameState().pipe(
            filter(value => value !== GameState.RUNNING))
        )))
    ).subscribe(timeDelta =>
        this.gameStateStore.update(state => (
          {
            timePassed: state.timePassed + timeDelta,
            timeDelta
          })),
      error => {
        headlineAnimation.startAnimation();
        console.error('error in gameLoop', error);
      },
      () => headlineAnimation.startAnimation()
    );

    // subscribe determine Winner
    this.gameStateQuery.selectCurrentGameState(GameState.RUNNING).pipe(
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
      ));
  }

  init(width: number, height: number) {
    this.gameStateStore.update({width, height, winner: null});
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

  cleanupKeysPressed(): void {
    this.gameStateStore.update({keysPressed: []});
  }
}
