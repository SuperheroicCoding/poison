import {Injectable} from '@angular/core';
import {animationFrameScheduler, interval, Observable} from 'rxjs';
import {filter, map, pairwise, switchMapTo, takeUntil, tap, timestamp} from 'rxjs/operators';
import {HeadlineAnimationService} from '../../core/headline-animation.service';
import {GameStateQuery} from './game-state.query';
import {GameState, GameStateStore} from './game-state.store';
import {PlayerService} from './player.service';

const FPS = 30;

@Injectable({providedIn: 'root'})
export class GameStateService {
  private gameLoop$: Observable<number>;

  constructor(private gameStateStore: GameStateStore,
              private gameStateQuery: GameStateQuery,
              private headlineAnimation: HeadlineAnimationService,
              private playerService: PlayerService) {
    this.gameLoop$ = interval(1000 / FPS, animationFrameScheduler).pipe(
      timestamp(),
      pairwise(),
      map(([value1, value2]) => value2.timestamp - value1.timestamp),
    );

    this.gameStateQuery.selectCurrentGameState(GameState.RUNNING).pipe(
      tap(x => this.headlineAnimation.stopAnimation()),
      switchMapTo(this.gameLoop$.pipe(
        takeUntil(
          this.gameStateQuery.selectCurrentGameState().pipe(
            filter(value => value !== GameState.RUNNING))
        ))),
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
  }

  init(width: number, height: number) {
    this.gameStateStore.update({width, height});
  }

  private initPlayers() {
    const {width, height} = this.gameStateQuery.getSnapshot();
    this.playerService.init([
      {x: width / 4, y: height / 2, color: [255, 10, 0]}, {
        x: (width / 4) * 3,
        y: height / 2,
        color: [0, 10, 255]
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


}
