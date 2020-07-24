import {Injectable} from '@angular/core';
import {layers, nextFrame, Sequential, sequential, SGDOptimizer, Tensor, Tensor2D, tidy, train} from '@tensorflow/tfjs';
import {MnistDataService} from './mnist-data.service';


const LEARNING_RATE = 0.15;

// How many examples the model should "see" before making a parameter update.
const BATCH_SIZE = 64;
// How many batches to train the model for.
const TRAIN_BATCHES = 100;

// Every TEST_ITERATION_FREQUENCY batches, test accuracy over TEST_BATCH_SIZE examples.
// Ideally, we'd compute accuracy over the whole test set, but for performance
// reasons we'll use a subset.
const TEST_BATCH_SIZE = 1000;
const TEST_ITERATION_FREQUENCY = 10;

@Injectable({providedIn: 'root'})
export class LearnedDigitsModelService {
  private model: Sequential;
  private optimizer: SGDOptimizer;

  lossValues: { 'batch': number, 'loss': number | Tensor, 'set': string }[];
  accuracyValues: { 'batch': number, 'accuracy': number | Tensor, 'set': string }[];
  isTraining = false;
  predictions: number[];
  labels: number[];
  testBatch: { xs: Tensor2D; labels: Tensor2D };
  testCustomBatch: Tensor2D;
  customPredictions: number[];

  constructor(private mnistData: MnistDataService) {
    this.model = sequential();
    this.model.add(layers.conv2d({
      inputShape: [28, 28, 1],
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'VarianceScaling'
    }));

    this.model.add(layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2]
    }));

    this.model.add(layers.conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'VarianceScaling'
    }));

    this.model.add(layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2]
    }));

    this.model.add(layers.flatten());

    this.model.add(layers.dense({
      units: 10,
      kernelInitializer: 'VarianceScaling',
      activation: 'softmax'
    }));

    this.optimizer = train.sgd(LEARNING_RATE);

    this.model.compile({
      optimizer: this.optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });
  }

  async train() {
    this.isTraining = true;
    this.lossValues = [];
    this.accuracyValues = [];

    for (let i = 0; i < TRAIN_BATCHES; i++) {
      const batch = this.mnistData.nextTrainBatch(BATCH_SIZE);

      let testBatch;
      let validationData;
      // Every few batches test the accuracy of the mode.
      if (i % TEST_ITERATION_FREQUENCY === 0) {
        testBatch = this.mnistData.nextTestBatch(TEST_BATCH_SIZE);
        validationData = [
          testBatch.xs.reshape([TEST_BATCH_SIZE, 28, 28, 1]), testBatch.labels
        ];
      }

      // The entire dataset doesn't fit into memory so we call fit repeatedly
      // with batches.
      const history = await this.model.fit(
        batch.xs.reshape([BATCH_SIZE, 28, 28, 1]) as Tensor,
        batch.labels as Tensor,
        {
          batchSize: BATCH_SIZE,
          validationData,
          epochs: 1
        });

      const loss = history.history.loss[0];
      this.lossValues = [...this.lossValues, {'batch': i, 'loss': loss, 'set': 'train'}];

      const accuracy = history.history.acc[0];
      if (testBatch != null) {
        this.accuracyValues = [...this.accuracyValues, {'batch': i, 'accuracy': accuracy, 'set': 'train'}];
      }

      batch.xs.dispose();
      batch.labels.dispose();
      if (testBatch != null) {
        testBatch.xs.dispose();
        testBatch.labels.dispose();
      }

      await nextFrame();
    }
    this.isTraining = false;
  }

  predictDrawing(imageData?: Float32Array) {
    this.testCustomBatch = this.mnistData.nextCustomTestBatch(imageData);
      tidy(() => {
        const output: any = this.model.predict(this.testCustomBatch.reshape([-1, 28, 28, 1]) as any);
        const axis = 1;
        this.customPredictions = Array.from(output.argMax(axis).dataSync());
      });
  }

  predict() {
    const testExamples = 100;
    this.testBatch = this.mnistData.nextTestBatch(testExamples);

    tidy(() => {
      const output: any = this.model.predict(this.testBatch.xs.reshape([-1, 28, 28, 1]) as any);
      const axis = 1;
      this.labels = Array.from(this.testBatch.labels.argMax(axis).dataSync());
      this.predictions = Array.from(output.argMax(axis).dataSync());
    });
  }

}
