import {Injectable} from '@angular/core';
import {TrainDataService} from './train-data.service';
import {distinctUntilChanged, filter, repeat, skipUntil, startWith, takeUntil} from 'rxjs/operators';
import {Subject, Observable, interval} from 'rxjs';
import {Point} from './point';
import {Perceptron} from './perceptron';
import {TrainData} from './train-data';

const defaultLearnRate = 0.3;

@Injectable()
export class BrainService {

  learnedDataPoints = 0;
  points: Point[] = [];
  perceptrons: Perceptron[][];
  isSinglePerceptron = false;

  private _learnRate = defaultLearnRate;
  private autoLearningSubject = new Subject<boolean>();
  private startAutoLearning$ = this.autoLearningSubject.pipe(filter(autoLearningEnabled => autoLearningEnabled));
  private stopAutoLearning$ = this.autoLearningSubject.pipe(filter(autoLearningEnabled => !autoLearningEnabled));

  private autoLearner$ = interval(50).pipe(
    distinctUntilChanged(),
    skipUntil(this.startAutoLearning$),
    takeUntil(this.stopAutoLearning$),
    repeat()
  );

  constructor(private trainDataService: TrainDataService) {
    this.autoLearner$.subscribe(() => this.train());
  }

  get autoLearning$(): Observable<boolean> {
    return this.autoLearningSubject.asObservable().pipe(startWith(false));
  }

  get learnRate() {
    return this._learnRate;
  }

  set learnRate(learnRate: number) {
    this._learnRate = learnRate;
  }

  createPerceptron(inputDimensions: number = 2): Perceptron {
    this.createMultiPerceptron(inputDimensions, [1]);
    return this.perceptrons[0][0];
  }

  createMultiPerceptron(inputDimensions: number = 2, amountPerceptronsPerLayer: number[] = [3, 1]): Perceptron[][] {
    this.learnedDataPoints = 0;
    this.learnRate = defaultLearnRate;
    this.isSinglePerceptron = amountPerceptronsPerLayer.length === 1;
    this.perceptrons = amountPerceptronsPerLayer.map((amountPerLayer, index) => {
      const layer = [];
      for (let i = 0; i < amountPerLayer; i++) {
        layer.push(new Perceptron(index > 0 ? amountPerceptronsPerLayer[index - 1] : inputDimensions));
      }
      return layer;
    });
    return this.perceptrons;
  }

  train(randomDataPointsToTest: number = 10) {
    if (this.points.length === 0) {
      return;
    }

    for (let i = 0; i < randomDataPointsToTest; i++) {
      const randomIndex = Math.random() * this.points.length;
      const point = this.points[Math.floor(randomIndex)];
      if (this.isSinglePerceptron) {
        const error = this.perceptrons[0][0].train(point.trainData, this.learnRate);
        if (error !== 0.0) {
          this.learnedDataPoints++;
          this._learnRate = Math.max(this.learnRate * (1 - this.learnedDataPoints / 1000), 0.0005);
        }
      } else {
        this.trainWithBackPropagation(point.trainData);
      }
    }
  }

  private trainWithBackPropagation(trainData: TrainData) {
    this.guess(trainData.inputs); // set input and guess data of perceptrons;
    const outputPerceptron = this.perceptrons[this.perceptrons.length - 1][0];
    const hiddenLayer = this.perceptrons[this.perceptrons.length - 2];
    const inputLayer = this.perceptrons[0];
    const error = outputPerceptron.lastGuess * (1 - outputPerceptron.lastGuess) * (trainData.expected - outputPerceptron.lastGuess);
    if (error !== 0.0) {
      outputPerceptron.trainWithLastInput(error, this.learnRate);
      for (let i = this.perceptrons.length - 2; i >= 0; i--) {
        const layer = this.perceptrons[i];
        layer.forEach((perceptron, index) => {
          const hiddenError = outputPerceptron.lastGuess * (1 - outputPerceptron.lastGuess) * error * outputPerceptron.weights[index];
          perceptron.trainWithLastInput(hiddenError, this.learnRate);
        });
      }

      this.learnedDataPoints++;
      this._learnRate = Math.max(this.learnRate * (1 - this.learnedDataPoints / 1000), 0.0005);
    }
  }


  updateTrainingData(): Point[] {
    this.points = this.trainDataService.createTestData(100);
    return this.points;
  }

  guess(input: number[]): number {
    if (this.isSinglePerceptron) {
      return this.perceptrons[0][0].guess(input);
    }
    let layerResult = [...input];
    for (let i = 0; i < this.perceptrons.length - 1; i++) {
      layerResult = this.perceptrons[i].map(perceptron =>
        perceptron.guessSig(layerResult)
      );
    }
    // last layer should always be only one output perceptron
    return this.perceptrons[this.perceptrons.length - 1][0].guess(layerResult);
  }

  guessSig(inputs: number[]) {
    if (this.isSinglePerceptron) {
      return this.perceptrons[0][0].guessSigSilent(inputs);
    }
    return this.guess(inputs);
  }

  toggleAutoTraining(autoTrainingEnabled: boolean) {
    this.autoLearningSubject.next(autoTrainingEnabled);
  }

  addPoint(point: Point) {
    this.points.push(point);
    this.guess(point.data);
  }

  clearPoints() {
    this.points = [];
  }

  guessSilent(data: number[]) {
    if (this.isSinglePerceptron) {
      return this.perceptrons[0][0].guessSilent(data);
    }
    let layerResult = [...data];
    for (let i = 0; i < this.perceptrons.length - 1; i++) {
      layerResult = this.perceptrons[i].map(perceptron =>
        perceptron.guessSigSilent(layerResult)
      );
    }
    // last layer should always be only one output perceptron
    return this.perceptrons[this.perceptrons.length - 1][0].guessSilent(layerResult);
  }
}
