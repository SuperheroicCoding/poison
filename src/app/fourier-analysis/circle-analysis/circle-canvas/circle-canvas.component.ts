import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as math from 'mathjs';
import {Complex} from 'mathjs';
import * as P5 from 'p5';
import {InputWave} from '../../state/input-wave.model';

interface CircleCanvasChanges extends SimpleChanges {
  waveWidth: SimpleChange;
  waveHeight: SimpleChange;
  wave: SimpleChange;
}


@Component({
  selector: 'app-circle-canvas',
  templateUrl: './circle-canvas.component.html',
  styleUrls: ['./circle-canvas.component.scss']
})
export class CircleCanvasComponent implements OnChanges, AfterViewInit, OnDestroy {

  @ViewChild('canvasContainer') canvasContainerRef: ElementRef;
  private canvasContainer: HTMLElement;

  @Input() waveWidth: number;
  @Input() waveHeight: number;
  @Input() wave: InputWave;

  private sketch: p5;
  private frequenzyToTest: number;
  private centers: number[];
  private yCenterMin = 0;
  private yCenterMax = 0;
  private finished = false;

  constructor(private zone: NgZone) {
  }


  ngAfterViewInit(): void {
    this.canvasContainer = this.canvasContainerRef.nativeElement;
    setTimeout(() => this.initCanvas(), 100);
  }

  ngOnChanges(changes: CircleCanvasChanges): void {
    if (changes.waveWidth != null || changes.waveHeight != null) {
      if (this.sketch != null) {
        this.sketch.resizeCanvas(this.waveWidth, this.waveHeight);
      }
    }
    if (changes.wave && this.wave !== null) {
      this.centers = [];
      this.frequenzyToTest = 0;// math.round(1000 / this.wave.lengthInMs, 6) as number;
      this.yCenterMin = 0;
      this.yCenterMax = 0;
      this.finished = false;
      if (this.sketch != null) {
        this.sketch.loop();
      }
    }
  }


  private initCanvas() {
    this.zone.runOutsideAngular(() => new P5(this.initSketch.bind(this), this.canvasContainer));
  }

  initSketch(sketch: p5) {
    this.sketch = sketch;

    const padding = 30;
    const xCenterGraphLeft = 400;
    const maxFrequencyToTest = 100;
    const frequencyStepWidth = 0.1;

    sketch.setup = () => {
      sketch.createCanvas(this.waveWidth, this.waveHeight);
    };

    sketch.draw = () => {
      const points = this.wave.points;
      const waveMs = this.wave.lengthInMs;
      const waveSec = waveMs / 1000;
      const samples = points.length;
      const minFrequencyToTest =  0; // math.round(1000 / this.wave.lengthInMs, 6) as number;
      const samplesToTake = Math.min(750, samples);
      const frequencySteps = (maxFrequencyToTest - minFrequencyToTest) / frequencyStepWidth;

      if (this.wave == null || this.wave.points == null || this.wave.points.length === 0) {
        return;
      }
      const w = sketch.width;
      const h = sketch.height;

      sketch.background(66);
      sketch.stroke(255, 255, 255);
      sketch.strokeWeight(0.5);
      sketch.noFill();


      drawCircle.call(this);
      drawFourierTransformationGraph.call(this);
      drawXAxis.call(this);
      mouseOverInfo.call(this);

      function drawCircle(this: CircleCanvasComponent) {
        sketch.push();

        let centerOfX = 0.;
        const radius = (h - (padding * 2)) / 2;
        sketch.text('Frequency: ' + this.frequenzyToTest, 2 * radius + padding, padding / 2);
        sketch.translate(radius + padding, radius + padding);
        sketch.ellipseMode('center');
        sketch.ellipse(0, 0, radius * 2);
        sketch.beginShape();
        let real = 0;
        let imag = 0;

        for (let n = 0; n < samplesToTake; n++) {
          const tIndex = Math.floor(sketch.map(n, 0, samplesToTake, 0, samples));
          const t = sketch.map(n, 0, samplesToTake, 0, waveSec);
          const normalizedSamplePoint = sketch.map(points[tIndex], -1, 1, 0, 1);

          const realStep = normalizedSamplePoint * Math.cos(-2 * Math.PI * (this.frequenzyToTest) * t);
          const imagStep = normalizedSamplePoint * Math.sin(-2 * Math.PI * (this.frequenzyToTest) * t);

          sketch.vertex(realStep * radius, -imagStep * radius);
          real += realStep;
          imag += imagStep;
        }

        if (this.frequenzyToTest <= maxFrequencyToTest && !this.finished) {
          centerOfX = (real * 20 / samplesToTake);
          const lastEntry = this.centers.length < 1 ? 0 : this.centers[this.centers.length - 1];
          const nextCenterIntegral = lastEntry + centerOfX;
          this.centers.push(nextCenterIntegral);
          this.yCenterMin = Math.min(nextCenterIntegral, this.yCenterMin);
          this.yCenterMax = Math.max(nextCenterIntegral, this.yCenterMax);
          this.frequenzyToTest = math.round(this.frequenzyToTest + frequencyStepWidth, 6) as number;
        } else {
          this.finished = true;
        }
        sketch.endShape();
        sketch.pop();
      }

      function drawFourierTransformationGraph(this: CircleCanvasComponent) {
        sketch.push();
        sketch.beginShape();
        for (let x = xCenterGraphLeft; x < w; x++) {
          const xInd = Math.floor(sketch.map(x, xCenterGraphLeft, w, 0, frequencySteps));
          if (xInd < this.centers.length) {
            const y = sketch.map(this.centers[xInd], this.yCenterMin, this.yCenterMax, h - padding, padding);
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
          const frequency = sketch.map(i, 0, labelAmount, 1000 / this.wave.lengthInMs, maxFrequencyToTest);
          sketch.text(frequency.toFixed(2) + 'hz', x, y);
          sketch.line(x, h - padding + 10, x, h - padding + 5);
        }
        sketch.pop();
      }


      function mouseOverInfo(this: CircleCanvasComponent) {
        const mX = sketch.mouseX;
        const mY = sketch.mouseY;
        if (mX > xCenterGraphLeft && mX < w && mY > padding && mY < h - padding) {
          const index = Math.floor(sketch.map(mX, xCenterGraphLeft, w, 0, frequencySteps));
          const frequency = math.round(sketch.map(index, 0, frequencySteps, minFrequencyToTest, maxFrequencyToTest), 1) as number;
          if (index < this.centers.length) {
            const y = sketch.map(this.centers[index], this.yCenterMin, this.yCenterMax, h - padding, padding);
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
          if (this.finished) {
            this.frequenzyToTest = frequency;
          }
        }
      }
    };
  }

  ngOnDestroy(): void {
    if (this.sketch != null) {
      this.sketch.remove();
    }
  }
}
