import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import P5 from 'p5';
import {InputWave} from '../../state/input-wave.model';

interface WaveCanvasChanges extends SimpleChanges {
  waveWidth: SimpleChange;
  waveHeight: SimpleChange;
  wave: SimpleChange;
}

@Component({
  selector: 'app-wave-canvas',
  templateUrl: './wave-canvas.component.html',
  styleUrls: ['./wave-canvas.component.scss']
})
export class WaveCanvasComponent implements OnChanges, AfterViewInit, OnDestroy {

  @ViewChild('canvasContainer', {static: true}) canvasContainerRef: ElementRef;
  private canvasContainer: HTMLElement;

  @Input() waveWidth: number;
  @Input() waveHeight: number;
  @Input() wave: InputWave;

  private sketch: P5;
  private wavePartsToDraw: number;

  constructor(@Inject(NgZone) private zone: NgZone) {
  }

  ngAfterViewInit(): void {
    this.canvasContainer = this.canvasContainerRef.nativeElement;
    setTimeout(() => this.initCanvas(), 100);
  }

  ngOnChanges(changes: WaveCanvasChanges): void {
    if (changes.waveWidth != null || changes.waveHeight != null) {
      if (this.sketch != null) {
        this.sketch.resizeCanvas(this.waveWidth, this.waveHeight);
      }
    }
    if (changes.wave) {
      this.wavePartsToDraw = 0;
    }
  }


  private initCanvas() {
    this.zone.runOutsideAngular(() => new P5(this.initSketch.bind(this), this.canvasContainer));
  }

  initSketch(sketch: P5) {
    this.sketch = sketch;

    const leftPadding = 20;
    const bottomPadding = 40;
    const topPadding = 10;

    sketch.setup = () => {
      sketch.createCanvas(this.waveWidth, this.waveHeight);
    };

    sketch.draw = () => {
      if (this.wave == null || this.wave.points == null || this.wave.points.length === 0) {
        return;
      }
      const w = sketch.width;
      const h = sketch.height;
      const points = this.wave.points;
      const samples = points.length;

      sketch.background(66);
      drawWave.call(this);
      drawXAxis.call(this);
      drawMouseOverInfoLine();

      function drawWave(this: WaveCanvasComponent) {
        sketch.stroke(255, 255, 255);
        sketch.strokeWeight(0.5);
        sketch.noFill();
        sketch.beginShape();
        if (this.wavePartsToDraw < samples) {
          this.wavePartsToDraw = Math.min(this.wavePartsToDraw + (samples / 90), samples);
        }

        for (let i = 0; i < this.wavePartsToDraw; i = i + Math.floor(Math.max(samples / w, 1))) {
          sketch.vertex(
            sketch.map(i, 0, samples, leftPadding, w),
            sketch.map(points[i], -1, 1, h - bottomPadding, topPadding)
          );
        }
        sketch.endShape();
      }

      function drawXAxis(this: WaveCanvasComponent) {
        sketch.line(leftPadding, h - bottomPadding + 10, w, h - bottomPadding + 10);
        sketch.textAlign('center', 'center');
        sketch.textSize(12);

        const stepWidthMs = this.wave.lengthInMs / 10;
        for (let i = 0; i < 10; i++) {
          const x = sketch.map(i, 0, 10, leftPadding, w);
          const y = h - bottomPadding + 30;
          sketch.text((stepWidthMs * i).toFixed(2) + 'ms', x, y);
          sketch.line(x, h - bottomPadding + 10, x, h - bottomPadding + 5);
        }
      }


      function drawMouseOverInfoLine() {
        const mX = sketch.mouseX;
        const mY = sketch.mouseY;
        if (mX > leftPadding && mX < w && mY > topPadding && mY < h - bottomPadding) {
          sketch.push();
          sketch.strokeWeight(1);
          sketch.stroke(123, 31, 162);
          sketch.line(mX, topPadding, mX, h - bottomPadding);
          const index = Math.floor(sketch.map(mX, leftPadding, w, 0, samples));
          const y = sketch.map(points[index], -1, 1, h - bottomPadding, topPadding);
          sketch.stroke(105, 240, 174);
          sketch.ellipseMode('center');
          sketch.ellipse(mX, y, 5);
          sketch.textAlign('left', 'center');
          sketch.stroke(255);
          sketch.text(points[index].toFixed(5), mX + 5, y);
          sketch.pop();
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
