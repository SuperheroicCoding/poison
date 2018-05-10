import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Circle} from '../../shared/circle';
import {CanvasDrawService} from './canvas-draw.service';
import {interval, Observable, animationFrameScheduler} from 'rxjs';
import {Vector} from '../../shared/vector';
import {Line} from '../../shared/line';
import {skipUntil} from 'rxjs/operators';


@Component({
  selector: 'app-canvas-view',
  templateUrl: './canvas-view.component.html',
  styleUrls: ['./canvas-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasViewComponent implements OnInit, AfterContentInit {


  @ViewChild('canvas') canvas: ElementRef;
  @Input() canvasWidth: number;
  @Input() canvasHeight: number;
  @Input() circles: Circle[];
  @Input() actives: Vector[];
  @Input() lines: Line[];
  @Output() onAddObject = new EventEmitter<Vector>();
  @Output() onReadyToPaint = new EventEmitter<number>();

  private draw$: Observable<number>;

  constructor(private canvasDrawService: CanvasDrawService) {
  }

  ngOnInit() {
    this.draw$ = interval(0, animationFrameScheduler).pipe(skipUntil(this.onReadyToPaint));
  }

  ngAfterContentInit(): void {
    this.canvas.nativeElement.width=this.canvasWidth;
    this.canvas.nativeElement.height=this.canvasHeight;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    this.canvasDrawService.initCtx(context);
    setTimeout(() => this.onReadyToPaint.emit(0), 1000);
    this.draw$.subscribe(this.draw.bind(this));
  }

  public onClick($event: MouseEvent) {
    this.onAddObject.emit(new Vector($event.offsetX, $event.offsetY));
  }

  private isInsideDrawArea(circle) {
    return circle.pos.x <= this.canvasWidth && circle.pos.y <= this.canvasHeight && circle.pos.x >= 0 && circle.pos.y >= 0;
  }

  private draw(step: number) {
    this.canvasDrawService.setFillColor('black');
    this.canvasDrawService.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    if (this.circles) {
      const filteredCircles = this.circles.filter(this.isInsideDrawArea.bind(this));
      if (filteredCircles.length < this.circles.length) {
        console.error('Some circles are out of draw area.',
          this.circles.filter((circle) => !this.isInsideDrawArea(circle))
        );
      }
      this.circles.forEach((circle) => this.canvasDrawService.drawCircle(circle, step));
    }
    if (this.actives) {
      this.canvasDrawService.setFillColor('red');
      this.actives.forEach((active) => this.canvasDrawService.drawVec(active, 2));
    }
    if (this.lines) {
      this.canvasDrawService.setStrokeColor('white');
      this.lines.forEach((line) => this.canvasDrawService.drawLineObj(line));
    }
    this.onReadyToPaint.emit(step);
  }
}
