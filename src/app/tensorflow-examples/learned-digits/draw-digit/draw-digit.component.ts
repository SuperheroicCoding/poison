import {Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-draw-digit',
  templateUrl: './draw-digit.component.html',
  styleUrls: ['./draw-digit.component.less']
})
export class DrawDigitComponent implements OnInit {

  @Output() change = new EventEmitter<Float32Array>();
  private sketch: p5;
  private readonly size = 28 * 10;

  constructor(@ViewChild('drawCanvas') drawCanvas: ElementRef) {

    this.sketch = new p5((p: p5) => {
      let shapedStarted = false;
      p.setup = () => {

        p.createCanvas(this.size, this.size);
        p.pixelDensity(1);
        p.background(0);
        p.stroke(255, 255, 255, 230);
        p.strokeCap(p.ROUND);
        p.strokeJoin(p.MITER);
        p.strokeWeight(12);
        p.noLoop();
        p.redraw();
      };

      const mouseInRange = () => {
        const x = p.mouseX;
        const y = p.mouseY;
        return x >= 0 && x < this.size && y < this.size && y >= 0;
      };

      p.mousePressed = () => {
        if (mouseInRange()) {
          if (!shapedStarted) {
            p.noFill();
            p.beginShape();
            shapedStarted = true;
          }
        }
      };

      p.mouseReleased = () => {
        if (shapedStarted) {
          p.endShape();
          shapedStarted = false;
          // scale the image down to 28 * 28;
          p.copy(0, 0, this.size, this.size, 0, 0, 28, 28);
          // read pixels into array and overwrite area with black
          p.loadPixels();
          const nextImage = new Float32Array(28 * 28);
          for (let col = 0; col < 28; col++) {
            for (let row = 0; row < 28; row++) {
              const index = (col * 4) + ((row * this.size) * 4);
              nextImage[col + row * 28] = p.pixels[index] / 255;
              p.pixels[index] = 0;
              p.pixels[index + 1] = 0;
              p.pixels[index + 2] = 0;
            }
          }
          p.updatePixels();
          this.change.emit(nextImage);
        }
      };

      p.mouseDragged = () => {
        if (mouseInRange()) {
          if (shapedStarted) {
            p.curveVertex(p.mouseX, p.mouseY);
          }
        }
      };

    }, drawCanvas.nativeElement);


  }

  reset() {
    this.sketch.background(0);
  }

  ngOnInit() {
  }


}
