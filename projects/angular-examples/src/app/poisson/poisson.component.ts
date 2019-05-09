import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Vector} from './shared/vector';
import {PoissonCalcService} from './poisson-calc.service';


@Component({
  selector: 'app-poisson',
  templateUrl: './poisson.component.html',
  styleUrls: ['./poisson.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoissonComponent implements OnInit, OnDestroy {

  canvasWidth = 600;
  canvasHeight = 600;

  play = false;

  constructor(public poissonCalc: PoissonCalcService) {
  }

  ngOnInit(): void {
    this.setup();
  }

  setup() {
    this.poissonCalc.setup(this.canvasWidth, this.canvasHeight);
  }

  reset(): void {
    this.setup();
  }

  calculate(): void {
    if (this.play) {
      this.poissonCalc.calculate();
    }
  }

  addPoint(vector: Vector) {
    this.poissonCalc.addPointForCalculation(vector);
  }

  setPlay(play: boolean) {
    this.play = play;
  }

  ngOnDestroy(): void {

  }
}
