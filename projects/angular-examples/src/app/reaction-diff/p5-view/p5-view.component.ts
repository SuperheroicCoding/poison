import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as p5 from 'p5';
import {ReactionDiffCalculator} from '../reaction-diff-calculator';

@Component({
  selector: 'app-p5-view',
  templateUrl: './p5-view.component.html',
  styleUrls: ['./p5-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class P5ViewComponent implements OnChanges, OnDestroy {

  @ViewChild('drawArea', { static: true }) drawArea: ElementRef;
  @Input() simWidth: number;
  @Input() simHeight: number;
  @Input() calcService: ReactionDiffCalculator;
  @Input() run = false;
  @Input() showFps = false;
  @Output() mousePressed: EventEmitter<{ x: number, y: number }> = new EventEmitter();

  private sketch: p5;
  private frameRate = 1;
  private drawOnce = true;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.simWidth || changes.simHeight) {
      if (this.sketch) {
        this.sketch.resizeCanvas(this.simWidth, this.simHeight);
      } else {
        this.sketch = new p5(p => this.initP5(p), this.drawArea.nativeElement);
      }
    }
  }

  private initP5(p: p5) {

    p.setup = () => {
      p.pixelDensity(1);
      p.createCanvas(this.simWidth, this.simHeight);
    };

    p.draw = () => {
      if (this.run) {
        p.background(51);
        performance.mark('calcNext-start');
        this.calcService.calcNext();
        this.calcService.drawImage(p);
        performance.mark('calcNext-end');
        performance.measure('calcNext', 'calcNext-start', 'calcNext-end');
      }

      if (this.drawOnce && !this.run) {
        this.calcService.drawImage(p);
        this.drawOnce = false;
      }

      if (this.showFps) {
        const frameRate = p.frameRate();
        this.frameRate = this.frameRate * 0.8 + frameRate * 0.2;
        p.fill('green');
        p.text('fps: ' + p.floor(this.frameRate), 10, 10);
      }
    };

    const addChemical = () => {
      const x = p.floor(p.mouseX);
      const y = p.floor(p.mouseY);
      if (x > -1 && x < p.width && y > -1 && y < p.height) {
        this.calcService.addChemical(x, y);
        this.drawOnce = true;
        // don't bubble up event.
        return false;
      }
      return true;
    };

    p.mouseClicked = addChemical;
    p.mouseDragged = addChemical;
    p.touchMoved = addChemical;
    p.touchStarted = addChemical;
  }

  ngOnDestroy(): void {
    this.sketch.remove();
  }
}

