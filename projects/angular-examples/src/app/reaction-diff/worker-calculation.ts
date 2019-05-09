import {Cell} from './cell';
import {WorkerPostParams} from '../rx/operator/map-worker';
import {CalcNextParam} from './calc-next-param';
import {AddChemicalsParams} from './add-chemicals-param';


export const calcNextDiffStep = function (input: CalcNextParam): WorkerPostParams<{ buffer: ArrayBufferLike, offsetRow: number }> {
  const {
    width, height, gridBuffer, dA, dB, f,
    k,
    w,
    offsetRow,
    offsetLength,
    dynamicKillFeed
  } = input;
  const grid = new Float32Array(gridBuffer);

  const nextBuf = new ArrayBuffer(width * offsetLength * 2 * Float32Array.BYTES_PER_ELEMENT);
  const next = new Float32Array(nextBuf);

  const setCell = (column: number, row: number, cell: Cell) => {
    const index = (column + (row - offsetRow) * width) * 2;
    next[index] = cell.a;
    next[index + 1] = cell.b;
  };

  const getCell = (column: number, row: number): Cell => {
    const index = (column + row * width) * 2;
    return {
      a: grid[index], b: grid[index + 1]
    };
  };

  /*    const wX = (i) => i < 0 ? width + i : i % width;
      const wY = (j) => j < 0 ? height + j : j % height;*/

  const laplace = (x: number, y: number) => {

    let sumA = 0.0;
    let sumB = 0.0;
    const add = (i, j, weight) => {
      const cell = getCell(i, j);
      sumA += cell.a * weight;
      sumB += cell.b * weight;
    };

    /*add(x, y, w.center);
    add(wX(x - 1), y, w.left);
    add(wX(x + 1), y, w.right);
    add(x, wY(y + 1), w.bottomCenter);
    add(x, wY(y - 1), w.topCenter);
    add(wX(x - 1), wY(y - 1), w.topLeft);
    add(wX(x - 1), wY(y + 1), w.bottomLeft);
    add(wX(x + 1), wY(y - 1), w.topRight);
    add(wX(x + 1), wY(y + 1), w.bottomRight);*/

    add(x, y, w.center);
    add(x - 1, y, w.left);
    add(x + 1, y, w.right);
    add(x, y + 1, w.bottomCenter);
    add(x, y - 1, w.topCenter);
    add(x - 1, y - 1, w.topLeft);
    add(x - 1, y + 1, w.bottomLeft);
    add(x + 1, y - 1, w.topRight);
    add(x + 1, y + 1, w.bottomRight);
    return {sumA, sumB};
  };

  const constrain = (val: number) => Math.min(1.0, Math.max(0.0, val));

  const calcNextCell = (cell: Cell,
                        laplaceA: number,
                        laplaceB: number, x: number, y: number): Cell => {

    let dynK = k;
    let dynF = f;
    if (dynamicKillFeed) {
      dynK = dynK + ((x / width) * 0.025);
      dynF = dynF + ((y / height) * 0.09);
    }
    const abb = cell.a * cell.b * cell.b;

    const nextA = cell.a +
      (dA * laplaceA) -
      abb +
      (dynF * (1 - cell.a));

    const nextB = cell.b +
      (dB * laplaceB) +
      abb -
      ((dynK + dynF) * cell.b);

    return {a: constrain(nextA), b: constrain(nextB)};
  };

  for (let x = 0; x < width; x++) {
    for (let y = offsetRow; y < offsetRow + offsetLength; y++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        // the borders are not encounterned;
        setCell(x, y, {a: 0, b: 0});
      } else {
        const lap = laplace(x, y);
        setCell(x, y, calcNextCell(
          getCell(x, y),
          lap.sumA,
          lap.sumB, x, y));
      }
    }
  }
  // we grid buffer to release resources. Otherwise the memory is eaten up really quick.
  return {data: {buffer: next.buffer, offsetRow}, transferList: [next.buffer, gridBuffer]};
};


export const addChemicals = function (data: AddChemicalsParams): WorkerPostParams<ArrayBufferLike> {
  const grid = new Float32Array(data.gridBuffer);
  const {x, y, r, width, height} = data;

  const setCell = (column: number, row: number, cell: Cell) => {
    const index = (column + row * width) * 2;
    grid[index] = cell.a;
    grid[index + 1] = cell.b;
  };

  const getCell = (column: number, row: number): Cell => {
    const index = (column + row * width) * 2;
    return {
      a: grid[index], b: grid[index + 1]
    };
  };


  for (let i = -r; i < r; i++) {
    for (let j = -r; j < r; j++) {
      const wrappedX = x + i < 0 ? width + i : (x + i) % width;
      const wrappedY = y + j < 0 ? height + j : (y + j) % height;
      const bToAdd = r / (i * i + j * j);
      const cell = getCell(wrappedX, wrappedY);
      setCell(wrappedX, wrappedY, {
        a: cell.a,
        b: Math.min(1.0, Math.max(0.0, cell.b + bToAdd))
      });
    }
  }

  return {data: grid.buffer, transferList: [grid.buffer]};

};
