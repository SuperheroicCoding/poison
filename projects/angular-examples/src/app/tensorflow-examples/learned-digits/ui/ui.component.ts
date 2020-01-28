import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import embed from 'vega-embed';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.less']
})
export class UiComponent implements OnChanges {

  @ViewChild('lossCanvas', { static: true }) lossCanvas: ElementRef;
  @ViewChild('accuracyCanvas', { static: true }) accuracyCanvas: ElementRef;
  @ViewChild('images', { static: true }) images: ElementRef;

  lossLabel: string;
  accuracyLabel: string;

  @Input() batch: any;
  @Input() predictions: any;
  @Input() labels: any;
  @Input() lossValues: any;
  @Input() accuracyValues: any;

  totalCorrect: number;
  totalPredictions: number;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.batch && changes.batch.currentValue) {
      this.showTestResults(this.batch, this.predictions, this.labels);
    }
    if (changes.accuracyValues && changes.accuracyValues.currentValue) {
      this.plotAccuracies(this.accuracyValues);
    }
    if (changes.lossValues && changes.lossValues.currentValue) {
      this.plotLosses(this.lossValues);
    }
  }

  showTestResults(batch, predictions, labels?) {
    const testExamples = batch.xs.shape[0];
    this.totalPredictions = testExamples;
    this.totalCorrect = 0;
    (this.images.nativeElement as HTMLDivElement).innerHTML = '';

    for (let i = 0; i < testExamples; i++) {
      const image = batch.xs.slice([i, 0], [1, batch.xs.shape[1]]);

      const div = document.createElement('div');
      div.className = 'pred-container';

      const canvas = document.createElement('canvas');
      this.draw(image.flatten(), canvas);

      const pred = document.createElement('div');

      const prediction = predictions[i];
      const label = labels[i];
      const correct = prediction === label;
      this.totalCorrect += correct ? 1 : 0;

      pred.className = `pred ${(correct ? 'pred-correct' : 'pred-incorrect')}`;
      pred.innerText = `pred: ${prediction}`;

      div.appendChild(pred);
      div.appendChild(canvas);

      this.images.nativeElement.appendChild(div);
    }
  }

  plotLosses(lossValues) {
    embed(
      this.lossCanvas.nativeElement, {
        '$schema': 'https://vega.github.io/schema/vega-lite/v3.2.1.json',
        'data': {'values': lossValues},
        'mark': {
          'type': 'line',
          'orient': 'vertical'
        },
        'width': 260,
        'encoding': {
          'x': {'field': 'batch', 'type': 'quantitative'},
          'y': {'field': 'loss', 'type': 'quantitative'},
          'color': {'field': 'set', 'type': 'nominal', 'legend': null},
        }
      } as any,
      {width: 360});
    this.lossLabel =
      'last loss: ' + lossValues[lossValues.length - 1].loss.toFixed(2);
  }

  plotAccuracies(accuracyValues) {
    embed(
      this.accuracyCanvas.nativeElement, {
        '$schema': 'https://vega.github.io/schema/vega-lite/v3.2.1.json',
        'data': {'values': accuracyValues},
        'width': 260,
        'mark': {'type': 'line', 'orient': 'vertical', 'legend': null},
        'encoding': {
          'x': {'field': 'batch', 'type': 'quantitative'},
          'y': {'field': 'accuracy', 'type': 'quantitative'},
          'color': {'field': 'set', 'type': 'nominal', 'legend': null},
        }
      } as any,
      {'width': 360});
    this.accuracyLabel = 'last accuracy: ' +
      (accuracyValues[accuracyValues.length - 1].accuracy * 100).toFixed(2) +
      '%';
  }

  private draw(image, canvas) {
    const [width, height] = [28, 28];
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = new ImageData(width, height);
    const data = image.dataSync();
    for (let i = 0; i < height * width; ++i) {
      const j = i * 4;
      imageData.data[j + 0] = data[i] * 255;
      imageData.data[j + 1] = data[i] * 255;
      imageData.data[j + 2] = data[i] * 255;
      imageData.data[j + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }

}
