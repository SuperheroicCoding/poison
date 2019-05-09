import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {CellWeights} from '../cell-weights';

@Component({
  selector: 'app-weights-config',
  templateUrl: './weights-config.component.html',
  styleUrls: ['./weights-config.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightsConfigComponent implements OnChanges {
  @Input() weights: CellWeights;
  @Output() onWeightsChanged: EventEmitter<CellWeights> = new EventEmitter<CellWeights>();

  sumOfWeights;

  constructor() {
  }

  ngOnChanges(simpleChanges) {
    if (simpleChanges.weights) {
      this.sumOfWeights = this.sumWeights();
    }
  }

  onWeightChanged() {
    this.sumOfWeights = this.sumWeights();
    if (this.sumOfWeights === 0) {
      this.onWeightsChanged.emit(this.weights);
    }
  }

  private sumWeights(): number {
    if (this.weights) {
      const sum = Object.keys(this.weights)
        .reduce((reduceSum: number, weight: string) =>
          reduceSum + this.weights[weight], 0.0);
      return Math.floor(sum * 1000) / 1000;
    }
    return -1;
  }
}
