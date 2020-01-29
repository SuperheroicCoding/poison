(function () {

  const usedFunctions = [];

  const usedFunctionTypes = [];

  function limit(value, lowLim, highLim) {
    return Math.max(Math.min(value, highLim), lowLim);
  }

  usedFunctions.push(limit);
  usedFunctionTypes.push({argumentTypes: {value: 'Number', lowLim: 'Number', highLim: 'Number'}, returnType: 'Number'});

  function smoothy(lowLim, highLim, value) {
    const smoothedValue = (value - lowLim) / (highLim - lowLim);
    return limit(smoothedValue, 0.0, 1.0);
  }

  usedFunctions.push(smoothy);
  usedFunctionTypes.push({argumentTypes: {lowLim: 'Number', highLim: 'Number', value: 'Number'}, returnType: 'Number'});

  function wrapAround(index, limit) {
    if (index >= limit) {
      return index - limit;
    }
    if (index < 0) {
      return limit + index;
    }
    return index;
  }

  usedFunctions.push(wrapAround);
  usedFunctionTypes.push({argumentTypes: {index: 'Number', limit: 'Number'}, returnType: 'Number'});

  function cellVal(grid, fluid, columnOffset, rowOffset, x, y, width, height) {
    const indexX = x + columnOffset;
    const indexY = y + rowOffset;
    const xIndex = wrapAround(indexX, width);
    const yIndex = wrapAround(indexY, height);
    return grid[fluid][yIndex][xIndex];
  }

  usedFunctions.push(cellVal);
  usedFunctionTypes.push({
    argumentTypes: {grid: 'ArrayTexture(1)', fluid: 'Number', columnOffset: 'Integer', rowOffset: 'Integer', x: 'Integer', y: 'Integer', width: 'Integer', height: 'Integer'},
    returnType: 'Number'
  });

  function calcWeightedSum(grid, fluid, weights, x, y, width, height) {
    let result = 0.0;
    let wIndex = 0;
    for (let dX = 1; dX > -2; dX--) {
      for (let dY = -1; dY < 2; dY++) {
        result += cellVal(grid, fluid, dX, dY, x, y, width, height) * weights[wIndex];
        wIndex++;
      }
    }
    return result;
  }

  usedFunctions.push(calcWeightedSum);
  usedFunctionTypes.push({
    argumentTypes: {grid: 'ArrayTexture(1)', fluid: 'Number', weights: 'Array', x: 'Integer', y: 'Integer', width: 'Integer', height: 'Integer'},
    returnType: 'Number'
  });

  function calcNextA(a, dA, laplaceA, abb, f) {
    return a +
      (dA * laplaceA) -
      abb +
      (f * (1.0 - a));
  }

  usedFunctions.push(calcNextA);
  usedFunctionTypes.push({
    argumentTypes: {a: 'Number', dA: 'Number', laplaceA: 'Number', abb: 'Number', f: 'Number'},
    returnType: 'Number'
  });

  function calcFluidBToAdd(grid, x, y, radius, threadX, threadY, height) {
    const i = Math.abs(x - threadX);
    const j = Math.abs(y - (height - threadY));
    const radPos = (i * i) + (j * j);

    // radius² >= radPos.
    const fluidBToAdd = smoothy(radius * radius, 0., radPos);
    return limit(fluidBToAdd, 0.0, 1.0);
  }

  usedFunctions.push(calcFluidBToAdd);
  usedFunctionTypes.push({
    argumentTypes: {grid: 'ArrayTexture(1)', x: 'Number', y: 'Number', radius: 'Number', threadX: 'Number', threadY: 'Number', height: 'Number'},
    returnType: 'Number'
  });

  function calcNextKernel(grid, weights, calcParams, addChemicalsParams) {
    const [dA, dB, f, k, dynkillfeed] = calcParams;
    const [xAdd, yAdd, radius, addChems] = addChemicalsParams;

    const {x: tX, y: tY, z: fluid} = this.thread;
    const {width, height} = this.constants;

    const xNormed = tX / width;
    const yNormed = tY / height;

    const fluidA = grid[0][tY][tX];
    let fluidB = grid[1][tY][tX];
    let isFluidA = 1.0 - fluid;
    let isFluidB = fluid;

    if (addChems > 0 && isFluidB > 0.0) {
      fluidB += calcFluidBToAdd(grid, xAdd, yAdd, radius, tX, tY, height);
    }

    // we calculate k and f depending on x, y when dynkillfeed = 1
    const kT = (k * (1.0 - dynkillfeed)) + ((k + (xNormed * 0.025)) * dynkillfeed);
    const fT = (f * (1.0 - dynkillfeed)) + (((f + 0.09) + (yNormed * -0.09)) * dynkillfeed);

    const abb = fluidA * fluidB * fluidB;

    if (isFluidA > 0.0) {
      const laplaceA = calcWeightedSum(grid, 0, weights, tX, tY, width, height);
      return limit(calcNextA(fluidA, dA, laplaceA, abb, fT), 0.0,1.0);
    }
    if (isFluidB > 0.0) {
      const laplaceB = calcWeightedSum(grid, 1, weights, tX, tY, width, height);
      const fB =  (fluidB + (dB * laplaceB) + abb - ((kT + fT) * fluidB));
      return limit(fB, 0.0,1.0)
    }
  }

  return {usedFunctions, usedFunctionTypes, calcNextKernel};
})();
