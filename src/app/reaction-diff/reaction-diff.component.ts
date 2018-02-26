import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ReactionDiffCalcServiceFactory} from './reaction-diff-calculation-service.factory';

import {CellWeights} from './cell-weights';
import {ReactionDiffConfigService} from './reaction-diff-config.service';
import {ReactionDiffCalcParams} from './reaction-diff-calc-params';
import {Observable} from 'rxjs/Observable';
import {MatSelectChange} from '@angular/material';
import {flatMap, map} from 'rxjs/operators';
import {ReactionDiffCalculator} from './reaction-diff-calculator';

@Component({
  selector: 'app-reaction-diff',
  templateUrl: './reaction-diff.component.html',
  styleUrls: ['./reaction-diff.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactionDiffComponent implements OnInit {

  public calcService: ReactionDiffCalculator;
  public start = false;
  public showFps = true;
  public width = 200;
  public height = 200;
  public numberWebWorkers: number;
  public cellWeights$: Observable<CellWeights>;
  public calcParams: ReactionDiffCalcParams;
  public examples: string[];
  public selectedExample: string;
  public addChemicalRadius: number;
  public speed = 1;
  public useGpu = true;
  calculationTime$: Observable<number>;

  constructor(private calcFactory: ReactionDiffCalcServiceFactory, private configService: ReactionDiffConfigService) {
  }

  public ngOnInit(): void {
    this.examples = this.configService.exampleOptions;

    this.calcService = this.calcFactory.createCalcService(this.width, this.height, this.useGpu);
    this.numberWebWorkers = this.calcService.numberThreads;
    this.cellWeights$ = this.configService.calcCellWeights$;
    this.configService.selectedExample$.subscribe((example) =>
      this.selectedExample = example
    );
    this.configService.calcParams$.subscribe((calcParams) =>
      this.calcParams = calcParams
    );
    this.configService.addChemicalRadius$.subscribe((radius) =>
      this.addChemicalRadius = radius
    );

    this.configService.speed$.subscribe((speed) =>
      this.speed = speed
    );

    this.calculationTime$ = Observable.interval(1000).pipe(
      flatMap(ignored => Observable.of(performance.getEntriesByName('calcNext'))),
      map((measures: PerformanceMeasure[]) => {
        if (measures.length === 0) {
          return 0;
        }
        const measuresmentsToTake = Math.min(measures.length, 50);
        const calcTime = measures.slice(measures.length - measuresmentsToTake)
          .reduce((acc, next) => acc + next.duration / measuresmentsToTake, 0);
        return calcTime;
      }));
  }

  public toggleRunSim(): void {
    this.start = !this.start;
  }

  public reset() {
    this.start = false;
    this.calcService.reset();
  }

  public addChemical(event: { x: number, y: number }) {
    this.calcService.addChemical(event.x, event.y);
  }

  public resetParametersWeights() {
    this.configService.resetCalcParams();
    this.configService.resetCalcCellWeights();
  }

  public updateDimension() {
    this.calcService.resize(this.width, this.height);
  }

  public updateCalcParams(calcParams: ReactionDiffCalcParams) {
    this.configService.updateCalcParams(calcParams);
  }

  public updateWeights(weights: CellWeights) {
    this.configService.updateCalcCellWeights(weights);
  }

  public setSelection(option: MatSelectChange) {
    this.configService.setSelection(option.value);
  }

  public updateAddChemicalRadius() {
    console.log(this.addChemicalRadius);
    this.configService.updateAddChemicalRadius(this.addChemicalRadius);
  }

  updateNumberOfWebWorkers() {
    this.calcService.updateNumberThreads(this.numberWebWorkers);
  }

  updateUseGpu() {
    this.start = false;
    this.calcService = this.calcFactory.createCalcService(this.width, this.height, this.useGpu);
  }

  updateSpeed() {
    this.configService.updateSpeed(this.speed);
  }
}
