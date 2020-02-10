import {Component, ElementRef, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ResizedEvent} from '../../shared/resized-event';
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
  inputWaveCanvasWidth: number;
  inputWaveCanvasHeight: number;
  circleCanvasWidth: number;
  circleCanvasHeight: number;

  constructor(
    private el: ElementRef,
    private fourierAnalysisQuery: FourierAnalysisQuery,
    private fourierAnalysisTestService: FourierAnalysisService,
    private inputWaveService: InputWaveService
  ) {
  }

  ngOnInit(): void {
    this.fourierAnalysis$ = this.fourierAnalysisQuery.select();
    this.isLoading$ = this.fourierAnalysisQuery.selectLoading();
  }

  onResize($event: ResizedEvent) {
    const availableWidth = Math.max(300, $event.newWidth - 32);

    this.inputWaveCanvasWidth = availableWidth;
    this.circleCanvasWidth = availableWidth;

    this.circleCanvasHeight = Math.max(250, this.circleCanvasWidth * (9 / 94));
    this.inputWaveCanvasHeight = Math.max(250, Math.round(this.inputWaveCanvasWidth * (9 / 64)));
  }
}
