import {Component, OnInit} from '@angular/core';
import {PolynominalRegretionService} from './polynominal-regretion.service';

@Component({
  selector: 'app-tensorflow-examples',
  templateUrl: './tensorflow-examples.component.html',
  styleUrls: ['./tensorflow-examples.component.less']
})
export class TensorflowExamplesComponent implements OnInit {
  randomCoefficients: { a: number; b: number; c: number; d: number };
  learnedCoefficients: { a: number; b: number; c: number; d: number };
  currentLoss: number;

  constructor(public polyService: PolynominalRegretionService) {
  }

  async ngOnInit() {
    this.randomCoefficients = this.polyService.currentCoefficients;
  }

  async learn() {
    await this.polyService.learnCoefficients(10);
    this.learnedCoefficients = this.polyService.currentCoefficients;
    const currentLossData = this.polyService.loss(this.polyService.predictionsAfter, this.polyService.trainingData.ys).dataSync();
    this.currentLoss = currentLossData[0];
  }

  setRandomCoefficients() {
    this.polyService.trueCoefficients = {
      a: Math.random() * 10 - 5,
      b: Math.random() * 10 - 5,
      c: Math.random() * 10 - 5,
      d: Math.random() * 10 - 5
    };
  }


}
