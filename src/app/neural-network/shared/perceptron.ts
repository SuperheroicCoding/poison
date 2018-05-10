import {TrainData} from './train-data';
import {LabelClass} from './point';
import {timer, Subscription} from 'rxjs';

export class Perceptron {

  weights: number[];
  bias = 1.0;
  isLearning = false;
  lastGuess: number;
  lastLearnRate: number;
  lastInput: number[];
  private learnTimeoutSub: Subscription;

  private static outputMapping(activationLevel: number): LabelClass {
    return activationLevel < 0.5 ? 0 : 1;
  }

  private static getRandomWeights(inputConnections: number) {
    const result = [];
    for (let i = 0; i < inputConnections; i++) {
      result.push(Math.random() * 2 - 1.0);
    }
    return result;
  }


  constructor(private inputConnections: number) {
    this.weights = Perceptron.getRandomWeights(inputConnections);
  }

  guess(inputs: number[]): number {
    this.lastGuess = this.guessSilent(inputs);
    this.lastInput = inputs;
    return this.lastGuess;
  }

  guessSilent(inputs: number[]): LabelClass {
    return Perceptron.outputMapping(this.guessSigSilent(inputs));
  }


  guessSigSilent(inputs: number[]): number {
    const weightedSum = inputs.reduce((prev, input, index) => prev + input * this.weights[index], this.bias);
    return 1 / (1 + Math.exp(-weightedSum));
  }

  guessSig(inputs: number[]): number {
    this.lastGuess = this.guessSigSilent(inputs);
    this.lastInput = [...inputs];
    return this.lastGuess;
  }

  train({inputs, expected}: TrainData, learnRate: number): number {
    this.lastLearnRate = learnRate;
    const guess = this.guess(inputs);
    const error = expected - guess;

    if (error !== 0.0) {
      this.isLearning = true;
      if (this.learnTimeoutSub) {
        this.learnTimeoutSub.unsubscribe();
      }
      this.learnTimeoutSub = timer(500).subscribe((ignore) => this.isLearning = false);
      const adjustedWeights = this.weights.map((weight, index) =>
        weight + error * inputs[index] * learnRate
      );

      this.bias = this.bias + error * learnRate;
      this.weights = adjustedWeights;
    }
    return error;
  }

  trainWithLastInput(error: number, learnRate: number): number {
    this.lastLearnRate = learnRate;

    if (error !== 0.0) {
      this.isLearning = true;
      if (this.learnTimeoutSub) {
        this.learnTimeoutSub.unsubscribe();
      }
      this.learnTimeoutSub = timer(500).subscribe((ignore) => this.isLearning = false);
      const adjustedWeights = this.weights.map((weight, index) =>
        weight + error * this.lastInput[index] * learnRate
      );

      this.bias = this.bias + error * learnRate;
      this.weights = adjustedWeights;
    }
    return error;
  }

  get classSeparatorLine(): { x0: number, y0: number, x1: number, y1: number } {
    if (this.inputConnections !== 2) {
      return undefined;
    }
    const y0 = this.bias / -this.weights[1];
    const y1 = (this.weights[0] + this.bias) / -this.weights[1];

    return {x0: 0, y0, x1: 0, y1};

  }

}
