import {Inject, Injectable, NgZone} from '@angular/core';
import {asapScheduler, from, interval, Observable, timer} from 'rxjs';
import {animationFrame} from 'rxjs/internal/scheduler/animationFrame';
import {map, switchMap, takeUntil, tap, timeInterval} from 'rxjs/operators';
import {HTML2CANVAS_INJECTION_TOKEN} from './html-2-canvas.token';
import {gaussian} from './random-util';
import {SC_THANOS_OPTIONS_TOKEN, ScThanosOptions} from './sc-thanos.options';

const PARTICLE_BYTE_LENGTH = 10;
const MIN_PARTICLE_ALPHA = ~~(255 * 0.01);
const HEIGHT_SCALE = 2;
const WIDTH_SCALE = 2;

interface ParticlesData {
  particles: Float32Array;
  maxParticleX: number;
  minParticleY: number;
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

  constructor(@Inject(HTML2CANVAS_INJECTION_TOKEN)
              private html2Canvas: any,
              @Inject(SC_THANOS_OPTIONS_TOKEN)
              private thanosOptions: ScThanosOptions,
              private ngZone: NgZone) {
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

  private static updateParticles(particlesData: ParticlesData, deltaTSec: number, animationT: number, maxWidth: number, maxHeight: number,
                                 animationLength: number) {
    const {particles, maxParticleX, minParticleY} = particlesData;
    const time = Math.max(animationT * animationT, animationT);
    const startAccelerateX = maxParticleX - (time * maxParticleX);
    const startAccelerateY = time * (maxHeight - minParticleY) + minParticleY;

    const lengthY = maxHeight - startAccelerateY;
    const accelerateRadiusPow = startAccelerateX * startAccelerateX + lengthY * lengthY;

    for (let i = 0; i < particles.length; i += PARTICLE_BYTE_LENGTH) {
      const {x, y, dx, dy, ax, ay, a} = ScThanosService.getParticleIndicesForBase(i);
      const particleX = particles[x];
      const particleY = particles[y];

      if (particleX > maxWidth || particleX < 0 || particleY > maxHeight || particleY < 0 || particles[a] < MIN_PARTICLE_ALPHA) {
        continue;
      }

      let pYLength = maxHeight - particleY;
      let pXLength = particleX;

      pXLength += Math.tan(pXLength / 20.12 * time) * 0.5;
      pXLength += (particleX % (deltaTSec)) * 0.5;
      pXLength += Math.sin((pXLength / 30 + 723.394) * time) * 11;
      pYLength += Math.cos((pYLength / 100 + 2323.234) * time) * 23;

      const pLength = pXLength * pXLength + pYLength * pYLength;
      if (pLength > accelerateRadiusPow) {
        particles[ax] = gaussian(100, 5) * (10000 / animationLength);
        particles[ay] = gaussian(-100, 2) * (10000 / animationLength);
      }

      particles[dx] += particles[ax] * deltaTSec;
      particles[dy] += particles[ay] * deltaTSec;
      particles[x] += particles[dx] * deltaTSec;
      particles[y] += particles[dy] * deltaTSec;
      particles[a] = 255 - Math.sqrt(particles[dx] * particles[dx] + particles[dy] * particles[dy]) / 1.2;
    }
  }

  private static drawParticles(drawCtx: CanvasRenderingContext2D, particles: Float32Array) {
    const {width, height} = drawCtx.canvas;
    drawCtx.clearRect(0, 0, width, height);
    const image = drawCtx.createImageData(width, height);
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

    const resultHeight = height * HEIGHT_SCALE;
    const resultWidth = width * WIDTH_SCALE;
    const resultCanvas: HTMLCanvasElement = document.createElement('canvas');
    resultCanvas.height = resultHeight;
    resultCanvas.width = resultWidth;

    const imageData = divCanvas.getContext('2d').getImageData(0, 0, width, height);
    const particlesData = ScThanosService.createParticlesForImageData(imageData, maxParticleCount, resultWidth, resultHeight);

    return {resultCanvas, particlesData};
  }

  private static createParticlesForImageData(imageData: ImageData, maxParticleCount: number, resultWidth: number, resultHeight: number) {
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

  vaporize(elem: HTMLElement): Observable<any> {
    return this.ngZone.runOutsideAngular(() => {
      elem.style.opacity = elem.style.opacity || '1';
      elem.style.transition = `opacity ${~~(this.thanosOptions.animationLength * .5)}ms ease-out`;
      return from(this.html2Canvas(elem, {backgroundColor: null, scale: 1, logging: false})).pipe(
        map((canvas: HTMLCanvasElement) => {
          const {resultCanvas, particlesData} = ScThanosService.prepareCanvasForVaporize(canvas, this.thanosOptions.maxParticleCount);
          elem.parentElement.style.position = elem.parentElement.style.position || 'relative';
          resultCanvas.style.position = 'absolute';
          resultCanvas.style.left = 0 + 'px';
          resultCanvas.style.top = '-' + elem.getBoundingClientRect().height + 'px';
          resultCanvas.style.zIndex = '2000';
          resultCanvas.style.opacity = '1';
          elem.style.opacity = '0';
          elem.insertAdjacentElement('beforebegin', resultCanvas);
          return {resultCanvas, particlesData};
        }),
        switchMap(({resultCanvas, particlesData}) => {
          let time = 0;

          return interval(1000 / 60, animationFrame)
            .pipe(
              timeInterval(asapScheduler),
              tap(deltaT => {
                time += deltaT.interval;
                const dT = deltaT.interval / 1000;
                const animationTime = time / this.thanosOptions.animationLength;
                ScThanosService.updateParticles(particlesData, dT, animationTime, resultCanvas.width, resultCanvas.height,
                  this.thanosOptions.animationLength);
                ScThanosService.drawParticles(resultCanvas.getContext('2d'), particlesData.particles);
              }),
              takeUntil(timer(this.thanosOptions.animationLength + 1000)),
              tap({
                complete: () => {
                  return resultCanvas.remove();
                }
              })
            );
        }),
      );
    });
  }
}



