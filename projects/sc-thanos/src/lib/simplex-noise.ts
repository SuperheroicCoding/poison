export interface Options {
  amplitude: number; // The base amplitude (default: 1.0)
  frequency: number; // The base frequency (default: 1.0)
  max: number; // The maximum scaled value to return (effective default: 1.0)
  min: number; // The minimum scaled value to return (effective default: -1.0)
  octaves: number; // Integer; the number of octaves to sum for noise generation (default: 1)
  persistence: number; // The persistence of amplitude per octave (default: 0.5)
  random: () => number; // A function that generates random values between 0 and 1 (default: Math.random)
}

function createOptionsWithDefaults(options?: Partial<Options>) {

  if (options != null) {
    if (options['amplitude'] && typeof options.amplitude !== 'number') {
      throw new Error('options.amplitude must be a number');
    }

    if (options['frequency'] && typeof options.frequency !== 'number') {
      throw new Error('options.frequency must be a number');
    }

    if (options['octaves'] && (typeof options.octaves !== 'number' ||
      !isFinite(options.octaves) ||
      Math.floor(options.octaves) !== options.octaves)) {
      throw new Error('options.octaves must be an integer');
    }

    if (options['persistence'] && typeof options.persistence !== 'number') {
      throw new Error('options.persistence must be a number');
    }

    if (options['random'] && typeof options.random !== 'function') {
      throw new Error('options.random must be a function');
    }

    if (options['min'] && typeof options.min !== 'number') {
      throw new Error('options.min must be a number');
    }

    if (options['max'] && typeof options.max !== 'number') {
      throw new Error('options.max must be a number');
    }
  }

  const optionsResult = {
    amplitude: 1.0,
    frequency: 1.0,
    max: 1.0,
    min: -1.0,
    octaves: 1,
    persistence: 0.5,
    random: Math.random,
    ...options
  };
  if (optionsResult.min > optionsResult.max) {
    throw new Error('min must be smaller max');
  }
  return optionsResult;
}

export class SimplexNoise {


  constructor(options?: Partial<Options>) {
    const {
      min,
      max,
      random,
      amplitude,
      frequency,
      octaves,
      persistence
    } = createOptionsWithDefaults(options);

    this.random = random;
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.octaves = octaves;
    this.persistence = persistence;

    this.scale = min === -1 && max === 1
      ? value => value
      : value => min + ((value + 1) / 2) * (max - min);

    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }

    let n: number;
    let q: number;
    for (let i = 255; i > 0; i--) {
      n = Math.floor((i + 1) * this.random());
      q = p[i];
      p[i] = p[n];
      p[n] = q;
    }

    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  static G3 = 1.0 / 6.0;

  static GRAD3D = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, -1], [0, 1, -1], [0, -1, -1]
  ];


  readonly amplitude: number;
  readonly frequency: number;
  readonly octaves: number;
  readonly perm: Uint8Array;
  readonly permMod12: Uint8Array;
  readonly persistence: number;
  readonly random: () => number;
  readonly scale: (value: number) => number;
  private memScale3D: { [key: string]: number } = {};

  dot(gs: number[], coords: number[]): number {
    return gs
      .slice(0, Math.min(gs.length, coords.length))
      .reduce((total, g, i) => total + (g * coords[i]), 0);
  }

  raw3D(x: number, y: number, z: number): number {
    // Skew the input space to determine which simplex cell we're in
    const s = (x + y + z) / 3.0; // Very nice and simple skew factor for 3D
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);
    const t = (i + j + k) * SimplexNoise.G3;
    const X0 = i - t; // Unskew the cell origin back to (x,y,z) space
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = x - X0; // The x,y,z distances from the cell origin
    const y0 = y - Y0;
    const z0 = z - Z0;

    // Determine which simplex we are in
    let i1: number, j1: number, k1: number; // Offsets for second corner of simplex in (i,j,k) coords
    let i2: number, j2: number, k2: number; // Offsets for third corner of simplex in (i,j,k) coords
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = i2 = j2 = 1;
        j1 = k1 = k2 = 0;
      } else if (x0 >= z0) {
        i1 = i2 = k2 = 1;
        j1 = k1 = j2 = 0;
      } else {
        k1 = i2 = k2 = 1;
        i1 = j1 = j2 = 0;
      }
    } else {
      if (y0 < z0) {
        k1 = j2 = k2 = 1;
        i1 = j1 = i2 = 0;
      } else if (x0 < z0) {
        j1 = j2 = k2 = 1;
        i1 = k1 = i2 = 0;
      } else {
        j1 = i2 = j2 = 1;
        i1 = k1 = k2 = 0;
      }
    }

    const x1 = x0 - i1 + SimplexNoise.G3; // Offsets for second corner in (x,y,z) coords
    const y1 = y0 - j1 + SimplexNoise.G3;
    const z1 = z0 - k1 + SimplexNoise.G3;
    const x2 = x0 - i2 + 2.0 * SimplexNoise.G3; // Offsets for third corner in (x,y,z) coords
    const y2 = y0 - j2 + 2.0 * SimplexNoise.G3;
    const z2 = z0 - k2 + 2.0 * SimplexNoise.G3;
    const x3 = x0 - 1.0 + 3.0 * SimplexNoise.G3; // Offsets for last corner in (x,y,z) coords
    const y3 = y0 - 1.0 + 3.0 * SimplexNoise.G3;
    const z3 = z0 - 1.0 + 3.0 * SimplexNoise.G3;

    // Work out the hashed gradient indices of the four simplex corners
    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;
    const gi0 = this.permMod12[ii + this.perm[jj + this.perm[kk]]];
    const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]];
    const gi2 = this.permMod12[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]];
    const gi3 = this.permMod12[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]];

    // Calculate the contribution from the four corners
    const t0 = 0.5 - x0 * x0 - y0 * y0 - z0 * z0;
    const n0 = t0 < 0 ? 0.0 : Math.pow(t0, 4) * this.dot(SimplexNoise.GRAD3D[gi0], [x0, y0, z0]);
    const t1 = 0.5 - x1 * x1 - y1 * y1 - z1 * z1;
    const n1 = t1 < 0 ? 0.0 : Math.pow(t1, 4) * this.dot(SimplexNoise.GRAD3D[gi1], [x1, y1, z1]);
    const t2 = 0.5 - x2 * x2 - y2 * y2 - z2 * z2;
    const n2 = t2 < 0 ? 0.0 : Math.pow(t2, 4) * this.dot(SimplexNoise.GRAD3D[gi2], [x2, y2, z2]);
    const t3 = 0.5 - x3 * x3 - y3 * y3 - z3 * z3;
    const n3 = t3 < 0 ? 0.0 : Math.pow(t3, 4) * this.dot(SimplexNoise.GRAD3D[gi3], [x3, y3, z3]);

    // Add contributions from each corner to get the final noise value.
    // The result is scaled to stay just inside [-1,1]
    return 94.68493150681972 * (n0 + n1 + n2 + n3);
  }

  scaled3D(x: number, y: number, z: number, resolution: number): number {
    const memIndex = `${Math.round(x * resolution)}${Math.round(y * resolution)}${Math.round(z * resolution)}`;
    const memElem = this.memScale3D[memIndex];
    if (memElem != null) {
      return memElem;
    }

    let amplitude = this.amplitude;
    let frequency = this.frequency;
    let maxAmplitude = 0;
    let noise = 0;

    for (let i = 0; i < this.octaves; i++) {
      noise += this.raw3D(x * frequency, y * frequency, z * frequency) * amplitude;
      maxAmplitude += amplitude;
      amplitude *= this.persistence;
      frequency *= 2;
    }
    const result = this.scale(noise / maxAmplitude);
    this.memScale3D[memIndex] = result;
    return result;
  }
}
