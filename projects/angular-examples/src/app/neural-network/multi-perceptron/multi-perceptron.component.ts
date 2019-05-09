import {Component, OnInit} from '@angular/core';
import {Point} from '../shared/point';
import {BrainService} from '../shared/brain.service';

@Component({
  selector: 'app-multi-perceptron',
  templateUrl: './multi-perceptron.component.html',
  styleUrls: ['./multi-perceptron.component.less']
})
export class MultiPerceptronComponent implements OnInit {

  width = 300;
  height = 300;
  perceptronsPerLayer = [2, 3, 1];

  constructor(private brainService: BrainService) {
  }

  ngOnInit() {
    this.brainService.createMultiPerceptron(2, this.perceptronsPerLayer);
  }

  get perceptrons() {
    return this.brainService.perceptrons;
  }

  get inputPerceptrons() {
    return this.perceptrons[0];
  }

  get hiddenPerceptrons() {
    return this.perceptrons[1];
  }

  get outputPerceptron() {
    return this.perceptrons[this.perceptrons.length - 1][0];
  }

  get learnedDataPoints() {
    return this.brainService.learnedDataPoints;
  }

  get learnRate() {
    return this.brainService.learnRate;
  }

  get points() {
    return this.brainService.points;
  }

  addPoint({x, y, click}: { x: number, y: number, click: 'left' | 'right' }) {
    const point = new Point(x / this.width, y / this.height, () => click === 'left' ? 1 : 0);
    this.brainService.addPoint(point);
  }
}
