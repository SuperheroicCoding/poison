import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {DataDrawerService} from './data-drawer.service';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-data-drawer',
  templateUrl: './data-drawer.component.html',
  styleUrls: ['./data-drawer.component.less']
})
export class DataDrawerComponent implements OnChanges {

  @ViewChild('plot') plot: ElementRef;
  @ViewChild('coeff') coeffContainer: ElementRef;

  @Input() caption: string;
  @Input() coeffCaption: string;
  @Input() data: { xs: tf.Tensor, ys: tf.Tensor };
  @Input() coeff: { a: number, b: number, c: number, d: number };
  @Input() predictions?: tf.Tensor;

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
