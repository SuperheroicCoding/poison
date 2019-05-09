import {Component, OnInit} from '@angular/core';
import {MnistDataService} from './mnist-data.service';
import {LearnedDigitsModelService} from './learned-digits-model.service';
import {HeadlineAnimationService} from '../../core/headline-animation.service';
import {Tensor, Tensor2D} from '@tensorflow/tfjs';

@Component({
  selector: 'app-learned-digits',
  templateUrl: './learned-digits.component.html',
  styleUrls: ['./learned-digits.component.less']
})
export class LearnedDigitsComponent implements OnInit {
  isLoading: boolean;
  hasBeenTrained = false;
  errorLoadingData = false;
  accuracyValues: { batch: number; accuracy: number | Tensor; set: string }[];
  lossValues: { batch: number; loss: number | Tensor; set: string }[];
  predictions: number[];
  batch: { xs: Tensor2D; labels: Tensor2D };
  labels: number[];

  drawingPredictions: number[];
  drawingBatch: { xs: Tensor2D; ys: number[] };
  drawingLabels: number[] = [];

  constructor(private data: MnistDataService, private deepnet: LearnedDigitsModelService,
              public headlineAnimation: HeadlineAnimationService) {
    this.headlineAnimation.stopAnimation();
  }

  ngOnInit() {
    setTimeout(async () => {
      try {
        this.isLoading = true;
        await this.data.load();
      } catch (error) {
        console.error('error loading mnist data', error);
        this.errorLoadingData = true;
      } finally {
        this.isLoading = false;
      }
    }, 200);
  }

  async train() {
    await this.deepnet.train();
    this.accuracyValues = this.deepnet.accuracyValues || [{'batch': 0, 'accuracy': 0.0, 'set': 'train'}];
    this.lossValues = this.deepnet.lossValues || [{'batch': 0, 'loss': 1.0, 'set': 'train'}];
    this.hasBeenTrained = true;
  }

  predict() {
    this.deepnet.predict();
    this.predictions = this.deepnet.predictions;
    this.batch = this.deepnet.testBatch;
    this.labels = this.deepnet.labels;
  }

  get isTraining() {
    return this.deepnet.isTraining;
  }

  testDigit($event: Float32Array) {
    this.deepnet.predictDrawing($event);
    this.drawingPredictions = this.deepnet.customPredictions;

    const xs = this.deepnet.testCustomBatch;
    this.drawingLabels.push(-1);
    this.drawingBatch = {xs: xs, ys: this.drawingPredictions};
  }
}
