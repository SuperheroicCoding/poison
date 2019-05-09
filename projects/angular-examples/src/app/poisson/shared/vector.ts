export class Vector {

  constructor(public x: number, public y: number) {
  }

  ng;

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  magFast() {
    return this.x * this.x + this.y * this.y;
  }

  unit(): Vector {
    return this.scalar(1 / this.mag());
  }

  scalar(scal: number): Vector {
    return new Vector(this.x * scal, this.y * scal);
  }

  setMag(mag: number): Vector {
    return this.unit().scalar(mag);
  }

  dot(vec: Vector): number {
    return vec.x * this.x + vec.y * this.y;
  }

  add(x: number, y: number): Vector {
    return new Vector(this.x + x, this.y + y);
  }

  addVec(vec: Vector): Vector {
    return new Vector(this.x + vec.x, this.y + vec.y);
  }

  fastDist(vec: Vector) {
    return Math.abs(Math.pow(this.x - vec.x, 2) + Math.pow(this.y - vec.y, 2));
  }

  dist(vec: Vector) {
    return Math.sqrt(this.fastDist(vec));
  }
}



