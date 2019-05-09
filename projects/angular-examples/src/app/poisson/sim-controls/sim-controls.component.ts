import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {PoissonConfigService} from '../poisson-config.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sim-controls',
  templateUrl: './sim-controls.component.html',
  styleUrls: ['./sim-controls.component.css'],
})
export class SimControlsComponent implements OnInit, OnDestroy {


  @Output() playChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() onReset: EventEmitter<boolean> = new EventEmitter();

  play = false;
  iterationsPerFrame: number;
  radius: number;
  k: number;

  private subscriptions: Subscription[] = [];

  constructor(private poissonConfig: PoissonConfigService) {

  }

  ngOnInit() {
    this.subscriptions.push(this.poissonConfig.r$.subscribe((r) => this.radius = r));
    this.subscriptions.push(this.poissonConfig.k$.subscribe((k) => this.k = k));
    this.subscriptions.push(this.poissonConfig.iterationsPerFrame$.subscribe((iters) => this.iterationsPerFrame = iters));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  radiusChanged(radius: number) {
    if (radius) {
      this.poissonConfig.r$.next(radius);
    }
  }

  kChanged(k: number) {
    if (k) {
      this.poissonConfig.k$.next(k);
    }
  }

  iterationsPerFrameChanged(iterationsPerFrame: number) {
    if (iterationsPerFrame) {
      this.poissonConfig.iterationsPerFrame$.next(iterationsPerFrame);
    }
  }


  private emitPlay() {
    this.playChanged.emit(this.play);
  }

  togglePlay() {
    this.play = !this.play;
    this.emitPlay();
  }

  reset(): void {
    this.play = false;
    this.emitPlay();
    this.onReset.emit(true);
  }

}
