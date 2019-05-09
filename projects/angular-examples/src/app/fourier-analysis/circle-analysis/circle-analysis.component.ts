import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {InputWave} from '../state/input-wave.model';
import {InputWaveQuery} from '../state/input-wave.query';

@Component({
  selector: 'app-circle-analysis',
  templateUrl: './circle-analysis.component.html',
  styleUrls: ['./circle-analysis.component.scss']
})
export class CircleAnalysisComponent implements OnInit {

  @Input() width: number;
  @Input() height: number;
  activeWave$: Observable<InputWave>;

  constructor(private waveQuery: InputWaveQuery) {
    this.activeWave$ = waveQuery.selectActive();
  }

  ngOnInit() {
  }

}
