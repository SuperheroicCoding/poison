import {Component, OnInit} from '@angular/core';
import {MnistDataService} from './mnist-data.service';
import {LearnedDigitsModelService} from './learned-digits-model.service';

@Component({
  selector: 'app-learned-digits',
  templateUrl: './learned-digits.component.html',
  styleUrls: ['./learned-digits.component.less']
})
export class LearnedDigitsComponent implements OnInit {
  isLoading: boolean;
  hasBeenTrained = false;
  errorLoadingData = false;

  constructor(private data: MnistDataService, private deepnet: LearnedDigitsModelService) {

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
    return this.deepnet.accuracyValues;
  }

  get lossValues() {
    return this.deepnet.lossValues;
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

}
