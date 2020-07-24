import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Tensor, Tensor2D} from '@tensorflow/tfjs';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {HeadlineAnimationService} from '../../core/headline-animation.service';
import {AskForNumberDialogComponent} from './ask-for-number-dialog/ask-for-number-dialog';
import {AskForNumberDialogData} from './ask-for-number-dialog/ask-for-number-dialog-data';
import {LearnedDigitsModelService} from './learned-digits-model.service';
import {MnistDataService} from './mnist-data.service';

@UntilDestroy()
@Component({
  selector: 'app-learned-digits',
  templateUrl: './learned-digits.component.html',
  styleUrls: ['./learned-digits.component.less']
})
export class LearnedDigitsComponent implements OnInit, OnDestroy {
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
  private nextDrawnImageSubject$ = new Subject<Float32Array>();

  constructor(private data: MnistDataService, private deepnet: LearnedDigitsModelService,
              public headlineAnimation: HeadlineAnimationService,
              private dialog: MatDialog) {
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

    this.nextDrawnImageSubject$.asObservable()
      .pipe(
        debounceTime(1000),
        untilDestroyed(this)
      )
      .subscribe(image => this.testDrawnDigit(image));
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

  nextDrawnImage($event: Float32Array) {
    this.nextDrawnImageSubject$.next($event);
  }

  private testDrawnDigit($event: Float32Array) {
    this.deepnet.predictDrawing($event);
    this.drawingPredictions = this.deepnet.customPredictions;

    const xs = this.deepnet.testCustomBatch;
    this.drawingLabels = [-1, ...this.drawingLabels];
    this.askForLabel(0);
    this.drawingBatch = {xs: xs, ys: this.drawingPredictions};
  }

  askForLabel(index: number) {
    const label = this.drawingLabels[index];
    const numberDrawn = label === -1 ? null : label;
    const drawingPrediction = this.drawingPredictions[index];
    const dialogData: AskForNumberDialogData = {numberDrawn, prediction: drawingPrediction};
    const dialogRef: MatDialogRef<AskForNumberDialogComponent, AskForNumberDialogData> = this.dialog.open(AskForNumberDialogComponent, {
      width: '250px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      this.drawingLabels[index] = result?.numberDrawn ?? -1;
      this.drawingLabels = [...this.drawingLabels];
    });
  }

  ngOnDestroy(): void {
  }
}
