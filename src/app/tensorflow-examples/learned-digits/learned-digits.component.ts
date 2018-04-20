import {Component, OnInit} from '@angular/core';
import {MnistDataService} from './mnist-data.service';
import {LearnedDigitsModelService} from './learned-digits-model.service';
import {HeadlineAnimationService} from '../../core/headline-animation.service';

@Component({
  selector: 'app-learned-digits',
  templateUrl: './learned-digits.component.html',
  styleUrls: ['./learned-digits.component.less']
})
export class LearnedDigitsComponent implements OnInit {
  isLoading: boolean;
  hasBeenTrained = false;
  errorLoadingData = false;
  private drawingPrediction: number;

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
    this.hasBeenTrained = true;
  }

  predict() {
    this.deepnet.predict();
  }

  get isTraining() {
    return this.deepnet.isTraining;
  }

  get accuracyValues() {
    return this.deepnet.accuracyValues || [{'batch': 0, 'accuracy': 0.0, 'set': 'train'}];
  }

  get lossValues() {
    return this.deepnet.lossValues || [{'batch': 0, 'loss': 1.0, 'set': 'train'}];
  }

  get predictions() {
    return this.deepnet.predictions;
  }

  get batch() {
    return this.deepnet.testBatch;
  }

  get labels() {
    return this.deepnet.labels;
  }

  testDigit($event: Float32Array) {
    this.drawingPrediction = this.deepnet.predictMyDrawing($event);
  }
}
