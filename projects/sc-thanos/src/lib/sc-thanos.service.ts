import {Inject, Injectable, NgZone} from '@angular/core';
import * as _html2canvas from 'html2canvas';
import {asapScheduler, from, interval, Observable} from 'rxjs';
import {animationFrame} from 'rxjs/internal/scheduler/animationFrame';
import {map, switchMap, takeWhile, tap, timeInterval} from 'rxjs/operators';
import {SC_THANOS_OPTIONS_TOKEN, ScThanosOptions} from './sc-thanos.options';
import {SimplexNoise} from './simplex-noise';

const html2canvas: Html2CanvasStatic = (_html2canvas as any);

const PARTICLE_BYTE_LENGTH = 10;
const MIN_PARTICLE_ALPHA = ~~(255 * 0.01);
const HEIGHT_SCALE = 5;
const WIDTH_SCALE = 2;
const DRAW_FLOW_FIELD = true;
const FLOW_FIELD_RES = 1. / 20.;

interface ParticlesData {
  particles: Float32Array;
  maxParticleX: number;
  minParticleY: number;
}

interface AnimationState {
  deltaTSec: number;
  animationT: number;
  maxWidth: number;
  maxHeight: number;
}

interface UpdateParticleParams {
  particlesData: ParticlesData;
  animationState: AnimationState;
  thanosOptions: ScThanosOptions;
  noise: SimplexNoise;
  seed: number;
}

interface ParticleIndices {
  x: number;
  y: number;
  dx: number;
  dy: number;
  ax: number;
  ay: number;
  r: number;
  g: number;
  b: number;
  a: number;
}

@Injectable()
export class ScThanosService {

  constructor(
    @Inject(SC_THANOS_OPTIONS_TOKEN)
    private thanosOptions: ScThanosOptions,
    @Inject(NgZone) private _ngZone: NgZone) {
  }

  private static getParticleIndicesForBase(base: number): ParticleIndices {
    return {
      x: base,
      y: base + 1,
      dx: base + 2,
      dy: base + 3,
      ax: base + 4,
      ay: base + 5,
      r: base + 6,
      g: base + 7,
      b: base + 8,
      a: base + 9,
    };
  }

  private static getColorIndicesForCoord(x, y, width): { a: number; r: number; b: number; g: number } {
    const red = y * (width * 4) + x * 4;
    return {r: red, g: red + 1, b: red + 2, a: red + 3};
  }

  private static updateParticles(params: UpdateParticleParams): void {
    const seed = params.seed;
    const noise: SimplexNoise = params.noise;
    const {
      deltaTSec,
      animationT,
      maxWidth,
      maxHeight
    } = params.animationState;
    const {animationLength, particleAcceleration} = params.thanosOptions;
    const {particles, maxParticleX, minParticleY} = params.particlesData;

    // the time is used to calculate the vaporization front.
    const time = Math.sin(animationT * (Math.PI / 2)) * 1.1;

    const startAccelerateX = maxParticleX - (time * maxParticleX);
    const startAccelerateY = time * (maxHeight - minParticleY) + minParticleY;

    const lengthY = maxHeight - startAccelerateY;
    const accelerateRadiusPow = startAccelerateX * startAccelerateX + lengthY * lengthY;

    for (let i = 0; i < particles.length; i += PARTICLE_BYTE_LENGTH) {
      const {x, y, dx, dy, ax, ay, a} = ScThanosService.getParticleIndicesForBase(i);
      const particleX = particles[x];
      const particleY = particles[y];

      // only update particles that are inside view and visible
      if (particleX > maxWidth || particleX < 0 || particleY > maxHeight || particleY < 0 || particles[a] < MIN_PARTICLE_ALPHA) {
        continue;
      }

      if (!(Math.abs(particles[ax]) > 0 || Math.abs(particles[ay]) > 0)) {
        let pYLength = maxHeight - particleY;
        let pXLength = particleX;

        // we calculate some random looking numbers and functions to have nice looking vaporizing front of particles
        // todo consider to use noise;
        pXLength += Math.tan(pXLength / 20.12 * time + seed) * 0.5;
        pXLength += (particleX % (deltaTSec)) * 0.5;
        pXLength += Math.sin((pXLength / 30 + 723.394) * time + seed * 12.5) * 11;
        pYLength += Math.tan(pYLength / 0.45 * time + seed * 1.5) * 0.5;
        pYLength += Math.cos((pYLength / 100 + 2323.234) * time + seed * 456.1) * 23;

        const pLength = pXLength * pXLength + pYLength * pYLength;
        if (pLength > accelerateRadiusPow) {
          particles[ax] = Math.random();
          particles[ay] = Math.random() * -1;
        }
      } else {
        // use noise to flow along velocity field
        const flowFieldAcc = ScThanosService.getXYFromFlowField(noise, seed, particleX, particleY);
        const accelerationX = flowFieldAcc[0];
        const accelerationY = flowFieldAcc[1];
        particles[ax] += accelerationX;
        particles[ay] += accelerationY;
      }

      // * Math.pow(1 + animationT, 4)
      particles[dx] += particles[ax] * particleAcceleration * deltaTSec;
      particles[dy] += particles[ay] * particleAcceleration * deltaTSec;
      particles[x] += particles[dx] * deltaTSec;
      particles[y] += particles[dy] * deltaTSec;
      // fade particle out ( very late);
      particles[a] *= 1 - Math.pow(animationT, 15); // 255 - Math.sqrt(particles[dx] * particles[dx] + particles[dy] * particles[dy]) / 1.2;
    }
  }

  private static drawParticles(drawCtx: CanvasRenderingContext2D, particles: Float32Array): void {
    const {width, height} = drawCtx.canvas;
    drawCtx.clearRect(0, 0, width, height);
    const image = drawCtx.getImageData(0, 0, width, height);
    const imageData = image.data;
    for (let i = 0; i < particles.length; i += PARTICLE_BYTE_LENGTH) {
      const particleX = particles[i];
      const particleY = particles[i + 1];
      const pI = ScThanosService.getParticleIndicesForBase(i);
      if (particleX > width || particleX < 0 || particleY > height || particleY < 0 || particles[pI.a] < MIN_PARTICLE_ALPHA) {
        continue;
      }
      const {r, g, b, a} = ScThanosService.getColorIndicesForCoord(~~particles[pI.x], ~~particles[pI.y], width);
      imageData[r] = ~~particles[pI.r];
      imageData[g] = ~~particles[pI.g];
      imageData[b] = ~~particles[pI.b];
      imageData[a] = ~~particles[pI.a];
    }
    drawCtx.putImageData(image, 0, 0);
  }

  private static prepareCanvasForVaporize(
    divCanvas: HTMLCanvasElement,
    maxParticleCount: number): {
    particlesData: ParticlesData,
    resultCanvas: HTMLCanvasElement
  } {
    const {width, height} = divCanvas;

    // scale result canvas to have more room to draw particles while vaporizing;
    const resultHeight = height * HEIGHT_SCALE;
    const resultWidth = width * WIDTH_SCALE;
    const resultCanvas: HTMLCanvasElement = document.createElement('canvas');
    resultCanvas.height = resultHeight;
    resultCanvas.width = resultWidth;

    const imageData = divCanvas.getContext('2d').getImageData(0, 0, width, height);
    const particlesData = ScThanosService.createParticlesForImageData(imageData, maxParticleCount, resultWidth, resultHeight);

    return {resultCanvas, particlesData};
  }

  private static createParticlesForImageData(imageData: ImageData, maxParticleCount: number, resultWidth: number, resultHeight: number):
    { minParticleY: number; maxParticleX: number; particles: Float32Array } {
    const {width, height} = imageData;
    let particleCandidates = 0;
    let particleCount = 0;

    const particleCandiatesList: { x: number; y: number }[] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const {a} = ScThanosService.getColorIndicesForCoord(x, y, width);
        if (imageData.data[a] >= MIN_PARTICLE_ALPHA) {
          particleCandidates++;
          particleCandiatesList.push({x, y});
        }
      }
    }

    const maxNumParticles = Math.min(particleCandidates, maxParticleCount);
    const particles = new Float32Array(Float32Array.BYTES_PER_ELEMENT * maxNumParticles * PARTICLE_BYTE_LENGTH);

    let maxParticleX = 0;
    let minParticleY = resultHeight;
    while (particleCount < maxNumParticles) {
      // select random index from candiates
      const index = ~~(Math.random() * particleCandiatesList.length);
      const {x, y} = particleCandiatesList[index];
      // overwrite index with last element to prevent double selection of particles
      particleCandiatesList[index] = particleCandiatesList.pop();

      maxParticleX = Math.max(maxParticleX, x);
      minParticleY = Math.min(minParticleY, y);
      const {dx, dy, ax, ay, r, g, b, a, ...xy} =
        ScThanosService.getParticleIndicesForBase(particleCount * PARTICLE_BYTE_LENGTH);
      particles[xy.x] = x;
      particles[xy.y] = y + resultHeight - height;
      particles[dx] = 0;
      particles[dy] = 0;
      particles[ax] = 0;
      particles[ay] = 0;

      const indicesImage = ScThanosService.getColorIndicesForCoord(x, y, width);

      particles[r] = imageData.data[indicesImage.r];
      particles[g] = imageData.data[indicesImage.g];
      particles[b] = imageData.data[indicesImage.b];
      particles[a] = imageData.data[indicesImage.a];
      particleCount++;
    }
    return {particles, maxParticleX, minParticleY};
  }

  private static getXYFromFlowField(noise: SimplexNoise, seed: number, x: number, y: number) {
    const sampleX = noise.scaled3D(x, y, seed + 33.23, FLOW_FIELD_RES);
    const sampleY = noise.scaled3D(x, seed / 13.23, y, FLOW_FIELD_RES) * -1.;
    return [sampleX, sampleY];
  }

  /**
   * start the vaporize effect.
   *
   * It's running outside the ngZone.
   */
  vaporize(elem: HTMLElement): Observable<any> {
    return this._ngZone.runOutsideAngular(() => this.vaporizeIntern(elem));
  }

  private vaporizeIntern(elem: HTMLElement): Observable<any> {
    elem.style.opacity = elem.style.opacity || '1';
    elem.style.transition = `opacity ${~~(this.thanosOptions.animationLength * .8)}ms ease-out`;
    const noise = new SimplexNoise({frequency: 0.01, min: 0});
    const seed = (new Date().getDate() * Math.random());
    const html2CanvasPromise: Html2CanvasPromise<HTMLCanvasElement> =
      html2canvas(elem, {backgroundColor: null, scale: 1, logging: false});
    return from(html2CanvasPromise).pipe(
      map(canvasFromHtmlElem => {
        const canvasAndParticles = ScThanosService.prepareCanvasForVaporize(canvasFromHtmlElem, this.thanosOptions.maxParticleCount);
        const {resultCanvas} = canvasAndParticles;

        elem.parentElement.style.position = elem.parentElement.style.position || 'relative';
        resultCanvas.style.position = 'absolute';
        resultCanvas.style.left = 0 + 'px';
        resultCanvas.style.top = '-' + elem.getBoundingClientRect().height * (HEIGHT_SCALE - 1) + 'px';
        resultCanvas.style.zIndex = '2000';
        resultCanvas.style.pointerEvents = 'none';

        elem.insertAdjacentElement('beforebegin', resultCanvas);
        // this should start the transition above defined
        elem.style.opacity = '0';
        return canvasAndParticles;
      }),
      switchMap(({resultCanvas, particlesData}) => {
        let time = 0;
        const {animationLength, maxParticleCount, particleAcceleration} = this.thanosOptions;
        return interval(1000 / 60, animationFrame)
          .pipe(
            timeInterval(asapScheduler),
            tap(deltaT => time += deltaT.interval),
            map(deltaT => ({
                deltaTSec: deltaT.interval / 1000,
                animationT: time / animationLength,
                maxWidth: resultCanvas.width,
                maxHeight: resultCanvas.height
              } as AnimationState)
            ),
            tap(animationState => {
              ScThanosService.updateParticles({
                particlesData,
                animationState,
                thanosOptions: {animationLength, maxParticleCount, particleAcceleration},
                noise,
                seed
              });
              ScThanosService.drawParticles(resultCanvas.getContext('2d'), particlesData.particles);
            }),
            takeWhile(animationState => animationState.animationT <= 1.),
            tap({
              complete: () => {
                return resultCanvas.remove();
              }
            })
          );
      }));
  }
}
