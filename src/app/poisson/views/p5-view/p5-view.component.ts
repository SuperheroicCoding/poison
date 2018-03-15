import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {Circle} from '../../shared/circle';
import {Vector} from '../../shared/vector';
import * as P5 from 'p5';

@Component({
  selector: 'app-p5-view',
  templateUrl: './p5-view.component.html',
  styleUrls: ['./p5-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class P5ViewComponent implements AfterContentInit {


  @ViewChild('p5Canvas') p5Canvas: ElementRef;
  @Input() width: number;
  @Input() height: number;
  @Input() circles: Circle[];
  @Input() circleColors: string[];
  @Input() actives: Vector[];
  @Output() onAddObject = new EventEmitter<Vector>();
  @Output() onReadyToPaint = new EventEmitter<number>();
  public frameRate = 0;

  private scetch: any;
  private time = 1;
  private maxR = 2;

  constructor() {
  }

  ngAfterContentInit() {
    this.scetch = new P5((p) => this.initP5(p), this.p5Canvas.nativeElement);
  }

  public onClick($event: MouseEvent) {
    this.onAddObject.emit(new Vector($event.offsetX, $event.offsetY));
  }


  initP5(p: any) {
    let wood;

    p.preload = () => {
      wood = p.loadImage('assets/wood.jpeg');
    };

    p.setup = () => {
      p.createCanvas(this.width, this.height, 'webgl');
      p.frameRate(60);
    };

    p.draw = () => {

      const frameCount = p.frameCount;

      const frameRate = p.frameRate();

      if (frameRate) {
        if (frameCount % 30 === 0) {
          this.frameRate = frameRate;
        }

        const deltaT = Math.floor(1000.0 / frameRate);
        this.time += deltaT;
      }
      p.colorMode('hsl');
      p.ambientLight(0, 0, 80);

      const locY = (p.mouseY / p.height - 0.5) * (-2);
      const locX = (p.mouseX / p.width - 0.5) * 2;

      const hueDir = p.noise(this.time * 0.001 + 5000) * 360;
      const saturationDir = p.noise(this.time * 0.001 + 30000) * 100;
      p.directionalLight(hueDir, saturationDir, 50, locX, locY, 0.25);

      p.camera(0, 0, 0);
      p.orbitControl();

      p.background(0);

      p.push();
      const position = p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2);
      position.setMag(500);
      p.translate(position.x, position.y, 30);
      p.fill(hueDir, saturationDir, 50);
      // p.sphere(50);
      p.pop();

      this.drawAreaFrame(p);

      if (this.circles && this.circles.length) {
        p.push();
        p.translate(-p.width / 2, -p.height / 2);
        this.circles.forEach(circle => {
          p.texture(wood);
          this.drawCircle(circle, this.time, p);
        });
        p.pop();
      }
      this.onReadyToPaint.emit(0);
    };
  }

  private drawAreaFrame(p: any) {
// left frame line

    const offset = 10;
    const widthHalf = p.width / 2;
    const cylinderWidth = 0.5;
    p.push();

    p.translate(-widthHalf - offset, 0, 10);
    p.cylinder(cylinderWidth, p.height + 2 * offset);
    p.pop();

    // right frame line
    p.push();
    p.translate(widthHalf + offset, 0, 10);
    p.cylinder(cylinderWidth, p.height + 2 * offset);
    p.pop();

    // top frame line
    p.push();
    const hHalf = p.height / 2;
    p.translate(0, -hHalf - offset, 10);
    p.rotateZ(p.PI / 2);
    p.cylinder(cylinderWidth, p.width + 2 * offset);
    p.pop();

    // buttom frame line
    p.push();
    p.translate(0, hHalf + 10, 10);
    p.rotateZ(p.PI / 2);
    p.cylinder(cylinderWidth, p.width + 2 * offset);
    p.pop();
  }

  drawCircle(circle: Circle, step: number, p: any): void {
    p.push();
    const {x, y} = circle.pos;
    p.translate(Math.floor(x), Math.floor(y), 10);
    p.rotate(circle.pos.magFast(), p.createVector(x, y, 0));

    const r = circle.r;
    this.maxR = Math.max(this.maxR, r);
    const detailX = p.floor(p.map(r, 1, this.maxR, 4, 24));
    const detailY = p.floor(p.map(r, 1, this.maxR, 4, 16));
    p.sphere(r, detailX, detailY);

    p.pop();
  }
}
