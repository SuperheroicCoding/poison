import {Component, OnInit} from '@angular/core';
import {BrainService} from '../shared/brain.service';
import {Point} from '../shared/point';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-perceptron-tab',
  templateUrl: './perceptron-tab.component.html',
  styleUrls: ['./perceptron-tab.component.less']
})
export class PerceptronTabComponent implements OnInit {

  width = 400;
  height = 400;

  autoLearning$: Observable<boolean>;

  constructor(private brainService: BrainService) {
  }

  get perceptron() {
    return this.brainService.perceptrons[0][0];
  }

  get points() {
    return this.brainService.points;
  }

  get learnRate() {
    return this.brainService.learnRate;
  }

  get learnedDataPoints() {
    return this.brainService.learnedDataPoints;
  }

  ngOnInit(): void {
    this.brainService.createPerceptron(2);
    this.brainService.updateTrainingData();
    this.autoLearning$ = this.brainService.autoLearning$;
  }

  addPoint({x, y, click}: { x: number, y: number, click: 'left' | 'right' }) {
    const point = new Point(x / this.width, y / this.height, () => click === 'left' ? 1 : 0);
    this.brainService.addPoint(point);
  }


}
