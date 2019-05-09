import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject, Observable} from 'rxjs';
import {CellWeights} from './cell-weights';
import {ReactionDiffCalcParams} from './reaction-diff-calc-params';
import {map, tap} from 'rxjs/operators';

interface ExampleParamOption {
  name: string;
  value: ReactionDiffCalcParams;
}

@Injectable()
export class ReactionDiffConfigService {

  static addChemicalRadius = 5;

  static defaultParams: ReactionDiffCalcParams = {
    diffRateA: 1.0,
    diffRateB: 0.5,
    feedRate: 0.055,
    killRate: 0.062,
    dynamicKillFeed: false
  };

  static mitosisParams: ReactionDiffCalcParams = {
    diffRateA: 1.0,
    diffRateB: 0.5,
    feedRate: 0.0367,
    killRate: 0.0649,
    dynamicKillFeed: false
  };
  // coral growth" simulation (f=.0545, k=.062)
  static coralGrowthParams: ReactionDiffCalcParams = {
    diffRateA: 1.0,
    diffRateB: 0.5,
    feedRate: 0.0545,
    killRate: 0.062,
    dynamicKillFeed: false
  };

  static dynamicKillFeed: ReactionDiffCalcParams = {
    diffRateA: 1.0,
    diffRateB: 0.5,
    feedRate: 0.01,
    killRate: 0.045,
    dynamicKillFeed: true
  };

  // pulsating" simulation (f=.0545, k=.062)
  static pulsatingParams: ReactionDiffCalcParams = {
    diffRateA: 1.0,
    diffRateB: 0.5,
    feedRate: 0.026,
    killRate: 0.059,
    dynamicKillFeed: false
  };

  static defaultWeights = {
    topLeft: 0.05, topCenter: 0.2, topRight: 0.05,
    left: 0.2, center: -1.0, right: 0.2,
    bottomLeft: 0.05, bottomCenter: 0.2, bottomRight: 0.05
  };

  static exampleWeights: Array<ExampleParamOption> = [{
    name: 'Default',
    value: ReactionDiffConfigService.defaultParams
  }, {
    name: 'Coral growth',
    value: ReactionDiffConfigService.coralGrowthParams
  }, {
    name: 'Mitosis',
    value: ReactionDiffConfigService.mitosisParams
  }, {
    name: 'Dynamic kill and feedrate.',
    value: ReactionDiffConfigService.dynamicKillFeed
  }, {
    name: 'Pulsation',
    value: ReactionDiffConfigService.pulsatingParams
  }
  ];

  public calcParams$: Observable<ReactionDiffCalcParams>;
  public calcCellWeights$: Observable<CellWeights>;
  public exampleOptions = ReactionDiffConfigService.exampleWeights.map(option => option.name);
  public selectedExample$: Observable<string>;
  public addChemicalRadius$: Observable<number>;
  public speed$: Observable<number>;

  private selectedExampleSubject$: Subject<ExampleParamOption> = new BehaviorSubject(ReactionDiffConfigService.exampleWeights[0]);
  private paramsSubject$: Subject<ReactionDiffCalcParams> = new BehaviorSubject(ReactionDiffConfigService.defaultParams);
  private weightsSubject$: Subject<CellWeights> = new BehaviorSubject(ReactionDiffConfigService.defaultWeights);
  private addChemicalRadiusSubject$: Subject<number> = new BehaviorSubject(ReactionDiffConfigService.addChemicalRadius);
  private speedSubject$: Subject<number> = new BehaviorSubject(1);

  constructor() {
    this.calcParams$ = this.paramsSubject$.asObservable()
      .pipe(
        map((calcParams) => Object.assign({}, calcParams))
      );
    this.calcCellWeights$ = this.weightsSubject$.asObservable().pipe(
      map((weights) => this.trimWeights(weights))
    );

    this.addChemicalRadius$ = this.addChemicalRadiusSubject$.asObservable();
    this.selectedExample$ =
      this.selectedExampleSubject$.asObservable().pipe(
        tap((example) =>
          (example) ? this.updateCalcParams(example.value) : null),
        map((example) => example ? example.name : null)
      );

    this.speed$ = this.speedSubject$.asObservable();
  }

  private trimWeights(weights: CellWeights): CellWeights {
    return Object.keys(weights).reduce(
      (result, key: string) =>
        Object.assign(result, {[key]: Math.round(weights[key] * 10000) / 10000}), {}) as CellWeights;
  }

  updateAddChemicalRadius(radius: number) {
    this.addChemicalRadiusSubject$.next(radius);
  }

  updateCalcParams(calcParams: ReactionDiffCalcParams) {
    this.selectedExampleSubject$.next(null);
    this.paramsSubject$.next(calcParams);
  }

  updateCalcCellWeights(weightsParams: CellWeights) {
    this.weightsSubject$.next(weightsParams);
  }

  updateSpeed(speed) {
    this.speedSubject$.next(speed);
  }

  resetAddChemicalRadius() {
    this.updateAddChemicalRadius(ReactionDiffConfigService.addChemicalRadius);
  }

  resetCalcParams() {
    this.selectedExampleSubject$.next(ReactionDiffConfigService.exampleWeights[0]);
  }

  resetCalcCellWeights() {
    this.updateCalcCellWeights(ReactionDiffConfigService.defaultWeights);
  }

  setSelection(name: string) {
    const foundOption = ReactionDiffConfigService.exampleWeights.find((option) => option.name === name);

    if (foundOption) {
      this.selectedExampleSubject$.next(foundOption);
    }
  }
}
