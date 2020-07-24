import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {Tensor} from '@tensorflow/tfjs';
import {DataDrawerService} from './data-drawer.service';

@Component({
  selector: 'app-data-drawer',
  templateUrl: './data-drawer.component.html',
  styleUrls: ['./data-drawer.component.less']
})
export class DataDrawerComponent implements OnChanges {

  @ViewChild('plot', { static: true }) plot: ElementRef;
  @ViewChild('coeff', { static: true }) coeffContainer: ElementRef;

  @Input() caption: string;
  @Input() coeffCaption: string;
  @Input() data: { xs: Tensor, ys: Tensor };
  @Input() coeff: { a: number, b: number, c: number, d: number };
  @Input() predictions?: Tensor;

  constructor(private dataDrawer: DataDrawerService) {
  }

  ngOnChanges(change: SimpleChanges) {
    this.draw();
  }

  draw() {
    if (this.data) {
      if (!this.predictions) {
        this.dataDrawer.plotData(this.plot.nativeElement, this.data);
      } else {
        this.dataDrawer.plotDataAndPredictions(this.plot.nativeElement, this.data, this.predictions);
      }
    }
    if (this.coeff) {
      this.dataDrawer.renderCoefficients(this.coeffContainer.nativeElement, this.coeff);
    }
  }

}
