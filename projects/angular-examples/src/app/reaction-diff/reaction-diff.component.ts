import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ReactionDiffCalcServiceFactory} from './reaction-diff-calculation-service.factory';

import {CellWeights} from './cell-weights';
import {ReactionDiffConfigService} from './reaction-diff-config.service';
import {ReactionDiffCalcParams} from './reaction-diff-calc-params';
import {interval, Observable, of, Subject} from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import {debounceTime, distinctUntilChanged, filter, flatMap, map, share, startWith, tap} from 'rxjs/operators';
import {ReactionDiffCalculator} from './reaction-diff-calculator';
import {HeadlineAnimationService} from '../core/headline-animation.service';
import {ActivatedRoute} from '@angular/router';
import {ReactionDiffKernelModules} from './reaction-diff-window';


interface Dimensions { width: number; height: number; }

type RouteData = Observable<{ kernels: ReactionDiffKernelModules }>;

@Component({
  selector: 'app-reaction-diff',
  templateUrl: './reaction-diff.component.html',
  styleUrls: ['./reaction-diff.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactionDiffComponent implements OnInit, OnDestroy {

  public calcService: ReactionDiffCalculator;
  private _start = false;
  public showFps = true;
  public width = 340;
  public height = 300;
  public numberWebWorkers: number;
  public cellWeights$: Observable<CellWeights>;
  public calcParams: ReactionDiffCalcParams;
  public examples: string[];
  public selectedExample: string;
  public addChemicalRadius: number;
  public speed = 1;
  public useGpu = true;
  dimensions$: Observable<Dimensions>;
  calculationTime$: Observable<string>;
  drawImageTime$: Observable<number>;

  private dimensionsSubject$: Subject<Dimensions> = new Subject();
  private kernels: ReactionDiffKernelModules;
  private routeData: RouteData;

  constructor(private calcFactory: ReactionDiffCalcServiceFactory,
              private configService: ReactionDiffConfigService,
              private headlineAnimation: HeadlineAnimationService,
              route: ActivatedRoute) {
    this.routeData = route.data as RouteData;
  }

  public ngOnInit() {
    this.examples = this.configService.exampleOptions;

    this.routeData.subscribe(data => {
      this.kernels = data.kernels;
      this.calcService = this.calcFactory.createCalcService(this.width, this.height, this.useGpu, this.kernels);
    });
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

    this.calculationTime$ = interval(1000).pipe(
      flatMap(ignored => {

        return of(performance.getEntriesByName('calcNext'));
      }),
      map((measures: PerformanceMeasure[]) => {
        if (measures.length === 0) {
          return '0.0';
        }
        const measuresmentsToTake = Math.min(measures.length, 30);
        return (measures.slice(measures.length - measuresmentsToTake)
          .reduce((acc, next) => {
            return acc + next.duration;
          }, 0) / measuresmentsToTake).toFixed(2);
      }));

    this.drawImageTime$ = interval(1000).pipe(
      flatMap(ignored => of(performance.getEntriesByName('drawImage'))),
      map((measures: PerformanceMeasure[]) => {
        if (measures.length === 0) {
          return 0;
        }
        const measuresmentsToTake = Math.min(measures.length, 30);
        return measures.slice(measures.length - measuresmentsToTake)
          .reduce((acc, next) => acc + next.duration / measuresmentsToTake, 0);
      }));


    const distinctDebouncedDimensions = this.dimensionsSubject$.pipe(
      filter((dim, index) => dim.width > 0 && dim.height > 0),
      tap((dim: Dimensions) => {
        this.width = dim.width;
        this.height = dim.height;
      }),
      debounceTime(500),
      distinctUntilChanged((x, y) => x.width === y.width && y.height === x.height),
      share()
    );
    distinctDebouncedDimensions.subscribe((dim) => {
      this.start = false;
      this.calcService.resize(dim.width, dim.height);
    });

    this.dimensions$ = distinctDebouncedDimensions.pipe(
      startWith({width: this.width, height: this.height})
    );
  }

  get start() {
    return this._start;
  }

  set start(start: boolean) {
    this._start = start;
  }

  public toggleRunSim(): void {
    this.start = !this.start;
    this.start ? this.headlineAnimation.stopAnimation() : this.headlineAnimation.startAnimation();
  }

  public reset() {
    this.start = false;
    this.headlineAnimation.stopAnimation();
    this.calcService.reset();
    this.headlineAnimation.startAnimation();
  }

  public addChemical(event: { x: number, y: number }) {
    this.calcService.addChemical(event.x, event.y);
  }

  public resetParametersWeights() {
    this.configService.resetCalcParams();
    this.configService.resetCalcCellWeights();
  }

  public updateDimension(width, height) {
    this.headlineAnimation.stopAnimation();
    this.dimensionsSubject$.next({width, height});
    this.headlineAnimation.startAnimation();
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
    this.configService.updateAddChemicalRadius(this.addChemicalRadius);
  }

  updateNumberOfWebWorkers() {
    this.calcService.updateNumberThreads(this.numberWebWorkers);
  }

  updateUseGpu() {
    this.start = false;
    this.calcService = this.calcFactory.createCalcService(this.width, this.height, this.useGpu, this.kernels);
    if (!this.useGpu) {
      this.numberWebWorkers = this.calcService.numberThreads;
    }
  }

  updateSpeed($event: number) {
    this.configService.updateSpeed($event);
  }

  ngOnDestroy(): void {
    this.calcService.cleanup();
  }
}
