import {Injectable} from '@angular/core';

@Injectable()
export class PoissonConfigService {

  public k = 15; // samples / iteration
  public iterationsPerFrame = 10;

  private _r = 5; // minimal distance between points
  private _w;

  constructor() {
  }

  set r(r: number) {
    this._r = r;
  }

  get r() {
    return this._r;
  }

  // cell width
  get w() {
    if (!this._w) {
      this._w = this.r / Math.sqrt(2.);
    }
    return this._w;
  }

}
