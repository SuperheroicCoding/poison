import {Component, ElementRef, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {FourierAnalysisQuery} from '../state/fourier-analysis.query';
import {FourierAnalysisService} from '../state/fourier-analysis.service';
import {FourierAnalysisState} from '../state/fourier-analysis.store';
import {InputWaveService} from '../state/input-wave.service';

@Component({
  selector: 'app-fourier-analysis',
  templateUrl: './fourier-analysis.component.html',
  styleUrls: ['./fourier-analysis.component.scss']
})
export class FourierAnalysisComponent implements OnInit {
  fourierAnalysis$: Observable<FourierAnalysisState>;
  isLoading$: Observable<boolean>;

  constructor(
    private el: ElementRef,
    private fourierAnalysisQuery: FourierAnalysisQuery,
    private fourierAnalysisTestService: FourierAnalysisService,
    private inputWaveService: InputWaveService
  ) {
  }

  ngOnInit() {
    this.fourierAnalysis$ = this.fourierAnalysisQuery.select();
    this.isLoading$ = this.fourierAnalysisQuery.selectLoading();
  }

  get inputWaveCanvasWidth() {
    const availableWidth = (this.el.nativeElement as HTMLDivElement).clientWidth;
    return availableWidth - 32;
  }

  get inputWaveCanvasHeight() {
    return Math.round(this.inputWaveCanvasWidth * (9 / 64));
  }

  get circleCanvasWidth() {
    const availableWidth = (this.el.nativeElement as HTMLDivElement).clientWidth;
    return availableWidth - 32;
  }

  get circleCanvasHeight() {
    return Math.round(this.inputWaveCanvasWidth * (9 / 64));
  }
}
