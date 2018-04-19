import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
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
export class P5ViewComponent implements OnChanges {

  @ViewChild('drawArea') drawArea: ElementRef;
  @Input() simWidth: number;
  @Input() simHeight: number;
  @Input() calcService: ReactionDiffCalculator;
  @Input() run = false;
  @Input() showFps = false;
  @Output() mousePressed: EventEmitter<{ x: number, y: number }> = new EventEmitter();

  private scetch: any;
  private frameRate = 1;
  private offBuff;
  private drawOnce = true;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.simWidth || changes.simHeight) {
      if (this.scetch) {
        this.scetch.resizeCanvas(this.simWidth, this.simHeight);
        this.offBuff.remove();
        this.offBuff = this.scetch.createGraphics(this.simWidth, this.simHeight);
      } else {
        this.scetch = new p5((p) => this.initP5(p), this.drawArea.nativeElement);
      }
    }
  }

  private initP5(p: any) {

    p.setup = () => {
      p.createCanvas(this.simWidth, this.simHeight);
      this.offBuff = p.createGraphics(this.simWidth, this.simHeight);
    };

    p.draw = () => {
      if (this.run) {
        p.background(51);
        this.calcService.calcNext();
        this.calcService.drawImage(this.offBuff);
      }

      if (this.drawOnce) {
        this.calcService.drawImage(this.offBuff);
        this.drawOnce = false;
      }

      p.image(this.offBuff, 0, 0);

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
        this.drawOnce = true
      }
    };

    p.mouseClicked = addChemical;
    p.mouseDragged = addChemical;
    p.touchMoved = addChemical;
    p.touchStarted = addChemical;
  }
}

