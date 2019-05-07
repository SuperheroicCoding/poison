import {Injectable} from '@angular/core';
import * as html2canvas from 'html2canvas';
import {from, interval, Observable, timer} from 'rxjs';
import {animationFrame} from 'rxjs/internal/scheduler/animationFrame';
import {delay, map, switchMap, takeUntil, tap, timeInterval} from 'rxjs/operators';

const PARTICLE_BYTE_LENGTH = 10;
const ANIMATION_LENGTH_MS = 5000;

function getColorIndicesForCoord(x, y, width): { a: number; r: number; b: number; g: number } {
  const red = y * (width * 4) + x * 4;
  return {r: red, g: red + 1, b: red + 2, a: red + 3};
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

function getParticleIndicesForBase(base: number): ParticleIndices {
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

function getParticlesIndicesForCoord(x, y, width): ParticleIndices {
  const base = y * (width * PARTICLE_BYTE_LENGTH) + x * PARTICLE_BYTE_LENGTH;
  return getParticleIndicesForBase(base);
}

@Injectable({
  providedIn: 'root',
})
export class ScThanosService {

  constructor() {
  }

  vaporize(elem: HTMLElement): Observable<any> {
    const parent = elem.parentElement;
    let canvasRef: HTMLCanvasElement;
    return from(html2canvas(elem)).pipe(
      map((canvas: HTMLCanvasElement) => {
        const {resultCanvas, particles} = this.prepareCanvasForVaporize(canvas);
        resultCanvas.style.position = 'fixed';
        resultCanvas.style.transform = `translateY(-${resultCanvas.height - elem.clientHeight}px)`;
        parent.replaceChild(resultCanvas, elem);
        canvasRef = resultCanvas;
        return {resultCanvas, particles};
      }),
      delay(2000),
      switchMap(({resultCanvas, particles}) =>
        interval(1000 / 60, animationFrame)
          .pipe(
            timeInterval(),
            tap(deltaT => {
              ScThanosService.updateParticles(particles, deltaT.interval / 1000);
              ScThanosService.drawParticles(resultCanvas.getContext('2d'), particles);
            })
          ),
      ),
      takeUntil(timer(ANIMATION_LENGTH_MS + 2000)),
      tap({complete: () => canvasRef.remove()})
    );
  }

  private prepareCanvasForVaporize(divCanvas: HTMLCanvasElement): { particles: Float32Array; resultCanvas: HTMLCanvasElement } {
    const {width, height} = divCanvas;
    const heightScale = 2;
    const widthScale = 2;
    const resultHeight = height * heightScale;
    const resultWidth = width * widthScale;
    const resultCanvas: HTMLCanvasElement = document.createElement('canvas');
    resultCanvas.height = resultHeight;
    resultCanvas.width = resultWidth;
    const resultContext = resultCanvas.getContext('2d');
    resultContext.imageSmoothingEnabled = true;

    const particles = new Float32Array(Float32Array.BYTES_PER_ELEMENT * width * height * PARTICLE_BYTE_LENGTH);

    const imageData = divCanvas.getContext('2d').getImageData(0, 0, width, height);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const {dx, dy, ax, ay, r, g, b, a, ...xy}: ParticleIndices = getParticlesIndicesForCoord(x, y, resultWidth);
        const indicesImage = getColorIndicesForCoord(x, y, width);
        particles[xy.x] = x;
        particles[xy.y] = y + resultHeight - height;
        particles[dx] = 0;
        particles[dy] = 0;
        particles[ax] = Math.random() * (height - y) + 1;
        particles[ay] = -Math.random() * (height - y) + 1;
        particles[r] = imageData.data[indicesImage.r];
        particles[g] = imageData.data[indicesImage.g];
        particles[b] = imageData.data[indicesImage.b];
        particles[a] = imageData.data[indicesImage.a];
      }
    }

    ScThanosService.drawParticles(resultContext, particles);

    return {resultCanvas, particles};
  }

  private static updateParticles(particles: Float32Array, deltaT: number) {
    for (let i = 0; i < particles.length; i += PARTICLE_BYTE_LENGTH) {
      const {x, y, dx, dy, ax, ay, a} = getParticleIndicesForBase(i);
      /*     particles[ax] += (Math.random() - 0.4) * 20;
           particles[ay] += (Math.random() - 0.6) * 20;*/
      particles[dx] += particles[ax] * deltaT;
      particles[dy] += particles[ay] * deltaT;
      particles[x] += particles[dx] * deltaT;
      particles[y] += particles[dy] * deltaT;
      particles[a] -= (255 * 1000 / ANIMATION_LENGTH_MS) * deltaT;
    }
  }

  private static drawParticles(drawCtx: CanvasRenderingContext2D, particles: Float32Array) {
    const {width, height} = drawCtx.canvas;
    drawCtx.clearRect(0, 0, width, height);
    const image = drawCtx.createImageData(width, height);
    const imageData = image.data;
    for (let i = 0; i < particles.length; i += PARTICLE_BYTE_LENGTH) {
      const pI = getParticleIndicesForBase(i);
      const {r, g, b, a} = getColorIndicesForCoord(~~particles[pI.x], ~~particles[pI.y], width);
      imageData[r] = ~~particles[pI.r];
      imageData[g] = ~~particles[pI.g];
      imageData[b] = ~~particles[pI.b];
      imageData[a] = ~~particles[pI.a];
    }
    drawCtx.putImageData(image, 0, 0);
  }

}



