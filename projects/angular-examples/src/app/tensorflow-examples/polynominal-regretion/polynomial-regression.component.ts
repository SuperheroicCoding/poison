import {Component, OnInit} from '@angular/core';
import {HeadlineAnimationService} from '../../core/headline-animation.service';
import {PolynomialRegressionService} from './polynomial-regression.service';

@Component({
  selector: 'app-polynomial-regressen',
  templateUrl: './polynomial-regression.component.html',
  styleUrls: ['./polynomial-regression.component.less']
})
export class PolynomialRegressionComponent implements OnInit {
  randomCoefficients: { a: number; b: number; c: number; d: number };
  learnedCoefficients: { a: number; b: number; c: number; d: number };
  currentLoss: number;
  isLearning = false;

  constructor(public polyService: PolynomialRegressionService, public headlineAnimation: HeadlineAnimationService) {
  }

  ngOnInit() {
    this.randomCoefficients =  this.polyService.currentCoefficients;
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
