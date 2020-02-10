import {
  AfterViewInit,
  Component,
  ElementRef, Inject,
  Input, NgZone,
  OnChanges,
  OnDestroy,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as math from 'mathjs';
import P5 from 'p5';
import {InputWave} from '../../state/input-wave.model';
import {Graphics} from 'p5';

const NEG_TWO_PI = -2 * Math.PI;
const CIRCLE_DRAW_SAMPLES = 800;

interface CircleCanvasChanges extends SimpleChanges {
  waveWidth: SimpleChange;
  waveHeight: SimpleChange;
  wave: SimpleChange;
}

interface CenterData {
  real: number;
  imag: number;
}


@Component({
  selector: 'app-circle-canvas',
  templateUrl: './circle-canvas.component.html',
  styleUrls: ['./circle-canvas.component.scss']
})
export class CircleCanvasComponent implements OnChanges, AfterViewInit, OnDestroy {

  @ViewChild('canvasContainer', {static: true}) canvasContainerRef: ElementRef;
  private canvasContainer: HTMLElement;

  @Input() waveWidth: number;
  @Input() waveHeight: number;
  @Input() wave: InputWave;

  private sketch: P5;
  private frequencyToTest: number;
  private centersOfFrequencies: { [key: number]: CenterData } = {};
  private centers: number[];
  private centerMin = 0;
  private centerMax = 0;
  private finished = false;

  constructor(@Inject(NgZone) private _ngZone: NgZone) {
  }


  ngAfterViewInit(): void {
    this.canvasContainer = this.canvasContainerRef.nativeElement;
    setTimeout(() => this.initCanvas(), 100);
  }

  ngOnChanges(changes: CircleCanvasChanges): void {
    if (changes.waveWidth != null || changes.waveHeight != null) {
      if (this.sketch != null) {
        this.sketch.resizeCanvas(this.waveWidth, this.waveHeight);
        this.sketch.redraw();
      }
    }
    if (changes.wave && this.wave !== null) {
      this.centersOfFrequencies = {};
      this.centers = [];
      this.frequencyToTest = 20;
      this.centerMin = 0;
      this.centerMax = 0;
      this.finished = false;
      if (this.sketch != null) {
        this.initSketch(this.sketch);
        this.sketch.loop();
      }
    }
  }


  private initCanvas() {
    this._ngZone.runOutsideAngular(() => new P5(this.initSketch.bind(this), this.canvasContainer));
  }

  initSketch(sketch: P5) {
    this.sketch = sketch;

    const padding = 30;
    const xCenterGraphLeft = 400;
    const minFrequencyToTest = 20;
    const maxFrequencyToTest = 500;
    const frequencyStepWidth = 1.;
    const frequencySteps = (maxFrequencyToTest - minFrequencyToTest) * frequencyStepWidth;
    let calcNextGenerator;
    let fourierCircleImg: Graphics;
    const samplesToTake = 3000;


    sketch.setup = () => {
      sketch.createCanvas(this.waveWidth, this.waveHeight);
    };

    sketch.draw = () => {
      if (this.wave == null || this.wave.points == null || this.wave.points.length === 0) {
        return;
      }
      const w = sketch.width;
      const h = sketch.height;

      sketch.background(66);
      sketch.stroke(255, 255, 255);
      sketch.strokeWeight(0.5);
      sketch.noFill();

      calcNumbers.call(this);
      drawCircle.call(this);
      drawFourierTransformationGraph.call(this);
      drawXAxis.call(this);
      drawMouseOverInfo.call(this);

      if (this.finished) {
        sketch.noLoop();
      }

      function drawCircle(this: CircleCanvasComponent) {
        if (fourierCircleImg != null) {
          sketch.image(fourierCircleImg, 0, 0);
        }
      }


      function calcNumbers(this: CircleCanvasComponent) {
        if (calcNextGenerator == null && !this.finished) {
          calcNextGenerator = calcNextFrequency.call(this);
        }
        if (!this.finished) {
          calcNextGenerator.next();
        } else {
          calcNextGenerator = null;
        }
      }

      function* calcNextFrequency(this: CircleCanvasComponent) {
        let frequency = minFrequencyToTest;
        let start: number;
        while (frequency < maxFrequencyToTest && !this.finished) {
          start = start == null ? performance.now() : start;
          let centerOfX = 0.;
          let real = 0;
          let imag = 0;
          for (let n = 0; n < samplesToTake; n++) {
            const tIndex = Math.floor(sketch.map(n, 0, samplesToTake, 0, this.wave.points.length));
            const t = sketch.map(n, 0, samplesToTake, 0, this.wave.lengthInMs / 1000);
            const normalizedSamplePoint = sketch.map(this.wave.points[tIndex], -1, 1, -1, 1);
            const rotation = NEG_TWO_PI * frequency * t;
            const realStep = normalizedSamplePoint * Math.cos(rotation);
            const imagStep = normalizedSamplePoint * Math.sin(rotation);
            real += realStep;
            imag += imagStep;
          }

          centerOfX = (real * real + imag * imag) / samplesToTake;
          this.centers.push(centerOfX);
          this.centersOfFrequencies[frequency] = {real: real / samplesToTake, imag: imag / samplesToTake};
          if (this.centerMax <= centerOfX) {
            setFrequencyToTest.call(this, frequency);
          }
          this.centerMin = Math.min(centerOfX, this.centerMin);
          this.centerMax = Math.max(centerOfX, this.centerMax);
          frequency = math.round(frequency + frequencyStepWidth, 3) as number;
          if (performance.now() - start > 5) {
            start = null;
            yield;
          }
        }
        this.finished = true;
      }

      function drawFourierTransformationGraph(this: CircleCanvasComponent) {
        sketch.push();
        sketch.beginShape();
        for (let x = xCenterGraphLeft; x < w; x++) {
          const xInd = Math.floor(sketch.map(x, xCenterGraphLeft, w, 0, frequencySteps));
          if (xInd < this.centers.length) {
            const y = sketch.map(this.centers[xInd], this.centerMin, this.centerMax, h - padding, padding);
            sketch.vertex(x, y);
          } else {
            break;
          }

        }
        sketch.endShape();
        sketch.pop();
      }

      function drawXAxis(this: CircleCanvasComponent) {
        sketch.push();
        sketch.line(xCenterGraphLeft, h - padding + 10, w, h - padding + 10);
        sketch.textAlign('center', 'center');
        sketch.textSize(12);

        const labelAmount = 10;
        for (let i = 0; i <= labelAmount; i++) {
          const x = sketch.map(i, 0, labelAmount, xCenterGraphLeft, w);
          const y = h - padding + 10;
          const frequency = sketch.map(i, 0, labelAmount, minFrequencyToTest, maxFrequencyToTest);
          sketch.text(frequency.toFixed(2) + 'hz', x, y);
          sketch.line(x, h - padding + 10, x, h - padding + 5);
        }
        sketch.pop();
      }
    };

    sketch.mouseMoved = () => {
      const mX = sketch.mouseX;
      const mY = sketch.mouseY;
      const w = sketch.width;
      const h = sketch.height;
      if (mX > xCenterGraphLeft && mX < w && mY > padding && mY < h - padding) {
        const index = Math.floor(sketch.map(mX, xCenterGraphLeft, w, 0, frequencySteps));
        const frequency = math.round(sketch.map(index, 0, frequencySteps, minFrequencyToTest, maxFrequencyToTest), 3) as number;

        if (index < this.centers.length) {
          if (this.finished) {
            setFrequencyToTest.call(this, frequency);
            sketch.redraw();
          }
        }
      }
    };

    function drawMouseOverInfo(this: CircleCanvasComponent) {
      const mX = sketch.mouseX;
      const mY = sketch.mouseY;
      const w = sketch.width;
      const h = sketch.height;
      if (mX > xCenterGraphLeft && mX < w && mY > padding && mY < h - padding) {
        const index = Math.floor(sketch.map(mX, xCenterGraphLeft, w, 0, frequencySteps));
        const frequency = math.round(sketch.map(index, 0, frequencySteps, minFrequencyToTest, maxFrequencyToTest), 3) as number;
        if (index < this.centers.length) {
          const y = sketch.map(this.centers[index], this.centerMin, this.centerMax, h - padding, padding);
          sketch.stroke(105, 240, 174);
          sketch.ellipseMode('center');
          sketch.ellipse(mX, y, 5);
          sketch.textAlign('left', 'center');
          sketch.stroke(255);
          sketch.text(frequency + ' Hz,' + this.centers[index].toFixed(5), mX + 5, y);
          sketch.push();
          sketch.strokeWeight(0.5);
          sketch.stroke(123, 31, 162);
          sketch.line(mX, padding, mX, h - padding);
          sketch.pop();
        }
      }
    }

    function drawCircleToBuffer(this: CircleCanvasComponent) {
      const radius = (sketch.height - (padding * 2)) / 2;
      fourierCircleImg = sketch.createGraphics(2 * (radius + padding), 2 * (radius + padding));
      const drawSamplesLength = this.wave.points.length;
      const stepSize = Math.max(1, Math.floor(drawSamplesLength / CIRCLE_DRAW_SAMPLES));

      fourierCircleImg.background(66);
      fourierCircleImg.stroke(255, 255, 255);
      fourierCircleImg.strokeWeight(0.5);
      fourierCircleImg.noFill();
      fourierCircleImg.text('Frequency: ' + this.frequencyToTest, radius, padding / 2);
      fourierCircleImg.translate(radius + padding, radius + padding);
      fourierCircleImg.ellipseMode('center');
      fourierCircleImg.ellipse(0, 0, radius * 2);
      fourierCircleImg.stroke(255, 255, 255, 60);


      fourierCircleImg.beginShape();
      for (let n = 0; n < drawSamplesLength; n += stepSize) {

        const tIndex = Math.floor(fourierCircleImg.map(n, 0, drawSamplesLength, 0, this.wave.points.length));
        const t = fourierCircleImg.map(n, 0, drawSamplesLength, 0, this.wave.lengthInMs / 1000);
        const normalizedSamplePoint = fourierCircleImg.map(this.wave.points[tIndex], -1, 1, 0, 1);
        const rotation = NEG_TWO_PI * this.frequencyToTest * t;
        const realStep = normalizedSamplePoint * Math.cos(rotation);
        const imagStep = normalizedSamplePoint * Math.sin(rotation);

        const x = realStep * radius;
        const y = -imagStep * radius;
        fourierCircleImg.curveVertex(x, y);
      }
      fourierCircleImg.endShape('close');

      fourierCircleImg.stroke(255, 255, 255);
      fourierCircleImg.ellipse(0, 0, 2, 2);
      fourierCircleImg.stroke(255, 0, 0);
      const centerData = this.centersOfFrequencies[this.frequencyToTest];
      if (centerData != null) {
        fourierCircleImg.ellipse(centerData.real * radius, -centerData.imag * radius, 3, 3);
      }
    }

    function setFrequencyToTest(this: CircleCanvasComponent, frequency: number) {
      this.frequencyToTest = frequency;
      drawCircleToBuffer.apply(this);
    }
  }

  ngOnDestroy(): void {
    if (this.sketch != null) {
      this.sketch.remove();
    }
  }


}
