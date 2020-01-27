import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IKernelRunShortcut} from 'gpu.js';

import {animationFrameScheduler, combineLatest, concat, interval, Observable, of, scheduled, Subscription, TimeInterval} from 'rxjs';
import {concatAll, debounceTime, distinctUntilChanged, map, mergeMap, scan, startWith, tap, timeInterval} from 'rxjs/operators';
import {GpuJsService} from '../core/gpujs.service';

interface Configuration {
  r: number;
  g: number;
  b: number;
  repetition: number;
  speed: number;
  useGPU: boolean;
}


@Component({
  selector: 'app-some-gpu-calculation',
  templateUrl: './some-gpu-calculation.component.html',
  styleUrls: ['./some-gpu-calculation.component.less']
})
export class SomeGpuCalculationComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gpuCanvas') gpuCanvas: ElementRef;
  @ViewChild('gpu2dCanvas') gpu2dCanvas: ElementRef;

  additionForm: FormGroup;
  calculationTime$: Observable<string>;

  private gpuColorizer: IKernelRunShortcut;
  private subscription: Subscription;

  constructor(private fb: FormBuilder, private gpu: GpuJsService) {
    this.createForm();

    this.calculationTime$ = interval(500).pipe(
      mergeMap(ignored => of(performance.getEntriesByName('createCanvasWithGPU'))),
      map((measures: PerformanceMeasure[]) => {
        if (measures.length === 0) {
          return 0;
        }
        const result = measures.reduce((acc, next) => acc + next.duration / measures.length, 0);
        if (measures.length > 60) {
          performance.clearMeasures();
          performance.clearMarks();
        }
        return result;
      }),
      startWith(0),
      map(time => time.toFixed(3))
    );
  }

  private createForm() {
    this.additionForm = this.fb.group({
      r: [255, [Validators.required, Validators.min(0), Validators.max(255)]],
      g: [255, [Validators.required, Validators.min(0), Validators.max(255)]],
      b: [255, [Validators.required, Validators.min(0), Validators.max(255)]],
      repetition: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      speed: [20, [Validators.required, Validators.min(1), Validators.max(100)]],
      useGPU: [true, [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    this.createGPUColorizer(this.additionForm.get('useGPU').value);
    const config$: Observable<Partial<Configuration>> =
      (this.additionForm.valueChanges as Observable<Configuration>).pipe(
        startWith(this.additionForm.value as Configuration),
        map(({r, g, b, repetition, speed}) => (
            {r, g, b, repetition, speed}
          )
        ),
        distinctUntilChanged(),
        debounceTime(300)
      );

    const gpuColorizerFrames$ =
      interval(Math.floor(1000 / 120), animationFrameScheduler).pipe(
        timeInterval<number>(),
        scan<TimeInterval<number>, number>((acc, value) => acc + value.interval, 0),
      );

    const calculateNextFrame$ = combineLatest([gpuColorizerFrames$, config$]).pipe(
      map(([frameTime, {r, g, b, repetition, speed}]) => ({frameTime, r, g, b, repetition, speed})));

    this.subscription = calculateNextFrame$.subscribe(config =>
      this.calculateNextFrame(config));

    this.subscription.add(
      this.additionForm.get('useGPU').valueChanges
        .subscribe(useGPU => this.createGPUColorizer(useGPU))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private createGPUColorizer(useGPU: boolean): void {
    const canvas = this.getCanvas(useGPU);
    if (useGPU) {
      const context = canvas.getContext('webgl2', {premultipliedAlpha: false});
      this.gpu.setUseGPU(useGPU, {canvas, context});
    } else {
      this.gpu.setUseGPU(false, {canvas});
    }

    const colorFn: any = new Function(`
     return function colorFn(frameTime, red, green, blue, repetition, speed, width, height) {
        const framedSpeed = frameTime * speed;
        const aspectRatio = width / height;
        let nX = this.thread.x / width * repetition;
        let nY = this.thread.y / height * repetition;
        let x = nX - Math.floor(nX);
        let y = nY - Math.floor(nY);
        const waveParam0 = (framedSpeed + x + 0.5 * y);
        const waveParam1 = (framedSpeed + y);
        const waveParam2 = (framedSpeed + y / (x + 0.1));

        this.color(
          red * Math.sin(waveParam0),
          green * Math.cos(waveParam1),
          blue * Math.tan(waveParam2),
          Math.random() / 2. + 0.5
        );
      }`)();
    this.gpuColorizer = this.gpu.createKernel(colorFn)
      .setGraphical(true)
      .setDynamicOutput(true);
  }

  private getCanvas(useGPU: boolean): HTMLCanvasElement {
    return useGPU ? this.gpuCanvas.nativeElement : this.gpu2dCanvas.nativeElement;
  }

  calculateNextFrame({frameTime, r, g, b, repetition, speed}): void {
    const {clientWidth: width = 500, clientHeight: height = 500} = this.gpuCanvas.nativeElement as HTMLCanvasElement;
    performance.mark('createCanvasWithGPU-start');
    this.gpuColorizer.setOutput([width, height]);
    this.gpuColorizer(frameTime / 1000., r / 255., g / 255., b / 255., repetition, speed / 20, width, height);
    performance.mark('createCanvasWithGPU-end');
    performance.measure('createCanvasWithGPU', 'createCanvasWithGPU-start', 'createCanvasWithGPU-end');
  }
}
