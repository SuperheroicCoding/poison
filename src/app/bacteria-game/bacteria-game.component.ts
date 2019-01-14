import {AfterViewInit, Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {filterNil} from '@datorama/akita';
import {from, Observable} from 'rxjs';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {GameStateQuery} from './state/game-state.query';
import {GameStateService} from './state/game-state.service';
import {GameState, GameStateState} from './state/game-state.store';
import {Bacteria, Player} from './state/player.model';
import {PlayerQuery} from './state/player.query';
import {PlayerService} from './state/player.service';

export function createImageDataFromBacterias(
  data8: Uint8ClampedArray,
  width: number,
  color: number[],
  bacterias: Bacteria[]
): Uint8ClampedArray {
  for (let i = 0; i < bacterias.length; i++) {
    const {x, y} = bacterias[i];
    const data8index = (y * width + x) * 4;
    data8[data8index] = color[0];   // r
    data8[data8index + 1] = color[1];   // g
    data8[data8index + 2] = color[2];   // b
    data8[data8index + 3] = 255;   // alpha
  }
  return data8;
}


@Component({
  selector: 'app-game-state',
  templateUrl: './bacteria-game.component.html',
  styleUrls: ['./bacteria-game.component.scss']
})
export class BacteriaGameComponent implements AfterViewInit {

  @ViewChild('canvasElement')
  private canvasRef: ElementRef;
  private width = 640;
  private height = 480;
  private cx: CanvasRenderingContext2D;

  state$: Observable<GameStateState>;
  fps$: Observable<string>;
  players$: Observable<Player[]>;

  constructor(private query: GameStateQuery,
              private gameStateService: GameStateService,
              private playerService: PlayerService,
              private playerQuery: PlayerQuery,
              private ngZone: NgZone
  ) {
    this.state$ = this.query.select();
    this.fps$ = this.query.selectFps();
    this.gameStateService.reset();
    this.players$ = this.playerQuery.selectAll();
    this.query.selectTimeDelta().pipe(
      filter(value => query.getSnapshot().currentState === GameState.RUNNING),
    ).subscribe(deltaTime => this.draw(Math.min(deltaTime / 1000, 0.1)));
  }

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvasRef.nativeElement;
    this.cx = canvasEl.getContext('2d');
    this.cx.imageSmoothingEnabled = false;
    canvasEl.width = this.width;
    canvasEl.height = this.height;
    this.cx.fillStyle = 'rgb(0,0,0)';
    this.cx.fillRect(0, 0, this.width, this.height);

  }

  startGame() {
    this.cx.fillStyle = 'rgb(0,0,0)';
    this.cx.fillRect(0, 0, this.width, this.height);
    this.gameStateService.init(this.width, this.height);
    this.gameStateService.start();
  }


  resetGame() {
    this.gameStateService.reset();
    this.draw(1. / 1000.);
  }

  private draw(deltaTime: number) {
    if (this.cx == null) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      const lastImage = this.cx.getImageData(0, 0, this.width, this.height);
      this.playerService.gameLoop(lastImage.data, this.width, this.height, deltaTime);

      this.cx.fillStyle = 'rgba(0,0,0)';
      this.cx.fillRect(0, 0, this.width, this.height);
      this.cx.fillStyle = 'rgba(200,200,200)';
      this.cx.fillRect(this.width / 2 - 10, 0, 20, this.height / 2 - 20);
      this.cx.fillRect(this.width / 2 - 10, this.height / 2 + 40, 20, this.height / 2 - 20);

      const image = this.cx.getImageData(0, 0, this.width, this.height);
      this.playerQuery.selectAll()
        .pipe(
          filterNil,
          take(1),
          switchMap(players => {
            return from(players);
          }),
          map(player => createImageDataFromBacterias(image.data, this.width, player.color, player.bacterias))
        ).subscribe((imageData) => {
        this.cx.putImageData(image, 0, 0);
      });
    });
  }


  mouseMoved($event: MouseEvent) {
    const {x, y} = this.getMousePos($event);
    this.playerService.updatePlayerPos(x, y);
  }

  private getMousePos(evt: MouseEvent) {
    const canvasEl = this.canvasRef.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
}


