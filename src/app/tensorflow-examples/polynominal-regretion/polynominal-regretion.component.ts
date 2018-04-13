import {Component, OnInit} from '@angular/core';
import {PolynominalRegretionService} from './polynominal-regretion.service';
import {HeadlineAnimationService} from '../../core/headline-animation.service';

@Component({
  selector: 'app-tensorflow-examples',
  templateUrl: './polynominal-regretion.component.html',
  styleUrls: ['./polynominal-regretion.component.less']
})
export class PolynominalRegretionComponent implements OnInit {
  randomCoefficients: { a: number; b: number; c: number; d: number };
  learnedCoefficients: { a: number; b: number; c: number; d: number };
  currentLoss: number;
  isLearning = false;

  constructor(public polyService: PolynominalRegretionService, public headlineAnimation: HeadlineAnimationService) {
  }

  async ngOnInit() {
    this.randomCoefficients = this.polyService.currentCoefficients;
  }

  async learn() {
    this.isLearning = true;
    this.headlineAnimation.stopAnimation();
    await this.polyService.learnCoefficients(50, 10);
    this.learnedCoefficients = this.polyService.currentCoefficients;
    const currentLossData = await this.polyService.loss(this.polyService.predictionsAfter, this.polyService.trainingData.ys).data();
    this.currentLoss = currentLossData[0];
    this.isLearning = false;
    this.headlineAnimation.startAnimation();
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
