import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Inject,
  NgZone,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Observable} from 'rxjs';
import {distinctUntilChanged, filter, map} from 'rxjs/operators';
import {GameStateQuery} from './state/game-state.query';
import {GameStateService} from './state/game-state.service';
import {GameState, GameStateState} from './state/game-state.store';
import {Bacteria, Player} from './state/player.model';
import {PlayerQuery} from './state/player.query';
import {PlayerService} from './state/player.service';
import {WinnerComponent} from './winner-info/winner.component';

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
  styleUrls: ['./bacteria-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BacteriaGameComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvasElement', { static: true })
  private canvasRef: ElementRef;


  private cx: CanvasRenderingContext2D;
  width = 640;
  height = 480;

  state$: Observable<GameStateState>;
  fps$: Observable<string>;
  players$: Observable<Player[]>;
  isRunning$: Observable<boolean>;
  private keysPressed: string[] = [];

  constructor(private query: GameStateQuery,
              private gameStateService: GameStateService,
              private playerService: PlayerService,
              private playerQuery: PlayerQuery,
              @Inject(NgZone) private _ngZone: NgZone,
              private matDialog: MatDialog
  ) {
    this.state$ = this.query.select();
    this.fps$ = this.query.selectFps();
    this.gameStateService.reset();
    this.players$ = this.playerQuery.selectAll();
    this.isRunning$ = this.query.selectCurrentGameState().pipe(map(state => state === GameState.RUNNING || state === GameState.PAUSED));

    this.query.selectTimeDelta().pipe(
      filter(value => query.getValue().currentState === GameState.RUNNING),
      untilDestroyed(this)
    ).subscribe(deltaTimeMs => {
        const dTSec = deltaTimeMs / 1000;
        this.draw(Math.min(dTSec, 0.1));
      }
    );

    this.query.selectWinnerId().pipe(
      filter(value => value != null),
      distinctUntilChanged(),
      untilDestroyed(this)
    )
      .subscribe(value => {
          this.matDialog.open(WinnerComponent);
        }
      );
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

  private draw(deltaTimeInSec: number) {
    if (this.cx == null) {
      return;
    }

    this._ngZone.runOutsideAngular(() => {
      this.cx.fillStyle = 'rgba(0,0,0,0.5)';
      this.cx.fillRect(0, 0, this.width, this.height);
      this.cx.fillStyle = 'rgb(200,200,200)';
      this.cx.fillRect(this.width / 2 - 50, 0, 20, this.height / 2 - 50);
      this.cx.fillRect(this.width / 2 - 50, this.height / 2 - 30, 20, this.height / 2 + 30);
      this.cx.fillRect(this.width / 2 + 30, 0, 20, this.height / 2 + 30);
      this.cx.fillRect(this.width / 2 + 30, this.height / 2 + 50, 20, this.height / 2 - 50);


      const image = this.cx.getImageData(0, 0, this.width, this.height);
      const data = new Uint8ClampedArray(image.data.buffer);
      this.playerQuery.getAll().forEach(
        player => createImageDataFromBacterias(data, this.width, player.color, player.bacterias)
      );
      this.playerService.gameLoop(data, this.width, this.height, deltaTimeInSec);
      this.cx.putImageData(image, 0, 0);

      this.playerQuery.getAll().forEach(player => {
        this.cx.strokeStyle = `rgba(${player.color.join(',')})`;
        this.cx.fillRect(player.x - 6, player.y - 0.5, 13, 2);
        this.cx.fillRect(player.x - .5, player.y - 6, 2, 13);
        this.cx.strokeRect(player.x - 6, player.y - 0.5, 13, 2);
        this.cx.strokeRect(player.x - .5, player.y - 6, 2, 13);
      });

    });
  }

  ngOnDestroy(): void {
    this.gameStateService.cleanupKeysPressed();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown($event: KeyboardEvent) {
    this.gameStateService.addKeyPress($event.key);
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp($event: KeyboardEvent) {
    this.gameStateService.removeKeyPress($event.key);
  }


}


