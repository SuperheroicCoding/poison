(function () {

  function whenGt(value, value2) {
    return Math.max(Math.sign(value - value2), 0.0);
  }

  function whenLt(value, value2) {
    return Math.max(Math.sign(value2 - value), 0.0);
  }

  function whenGe(value, value2) {
    return 1.0 - Math.max(Math.sign(value2 - value), 0.0);
  }

  function whenLe(value, value2) {
    return 1.0 - Math.max(Math.sign(value - value2), 0.0);
  }

  function and(a, b) {
    return a * b;
  }

  function limit(value, lowLim, highLim) {
    return Math.max(Math.min(value, highLim), lowLim);
  }

  function smoothy(lowLim, highLim, value) {
    return limit((value - lowLim) / (highLim - lowLim), 0.0, 1.0);
  }

  function mixValues(value, value2, ratio) {
    return (value * (1.0 - ratio)) + (value2 * ratio);
  }

  function wrapAround(value, value2) {
    const greater = whenGe(value, value2);
    const smallerZero = whenLt(value, 0.0);
    const inBetween = and(whenGe(value, 0.0), whenLt(value, value2));
    return (greater * (value - value2)) + (smallerZero * (value2 + value)) + (inBetween * value);
  }

  function cellValue(grid, fluid, columnOffset, rowOffset) {
    const yIndex = wrapAround(this.thread.y + rowOffset, this.constants.height);
    const xIndex = wrapAround(this.thread.x + columnOffset, this.constants.width);
    return grid[fluid][yIndex][xIndex];
  }

  function calcWeightedSum(grid, fluid, weights) {
    return cellValue(grid, fluid, -1.0, 1.0) * weights[0] +
      cellValue(grid, fluid, 0.0, 1.0) * weights[1] +
      cellValue(grid, fluid, 1, 1.0) * weights[2] +
      cellValue(grid, fluid, -1.0, 0.0) * weights[3] +
      cellValue(grid, fluid, 0.0, 0.0) * weights[4] +
      cellValue(grid, fluid, 1, 0.0) * weights[5] +
      cellValue(grid, fluid, -1.0, -1) * weights[6] +
      cellValue(grid, fluid, 0.0, -1) * weights[7] +
      cellValue(grid, fluid, 1, -1) * weights[8];
  }

  function calcNextA(a, dA, laplaceA, abb, f) {
    return a +
      (dA * laplaceA) -
      abb +
      (f * (1 - a));
  }

  function calcFluidBToAdd(grid, x, y, radius) {
    // even cells are for fluid A. Odd cells are fluid B.
    const isFluidB = this.thread.z % 2.0;
    const i = Math.abs(x - this.thread.x);
    const j = Math.abs(y - (this.constants.height - this.thread.y));
    const radPos = (i * i) + (j * j);

    // we only want to change values for fluid B (oddEvenMod = 1) and when radius² >= radPos.
    const fluidBToAdd = isFluidB * smoothy(radius * radius, 0, radPos);
    return limit(fluidBToAdd, 0.0, 1.0);
  }


  const usedFunctions = {
    whenLe,
    whenGe,
    whenLt,
    whenGt,
    and,
    limit,
    smoothy,
    mixValues,
    wrapAround,
    cellValue,
    calcWeightedSum,
    calcNextA,
    calcFluidBToAdd
  };

  function calcNextKernel(grid, weights, calcParams, addChemicalsParams) {
    const dA = calcParams[0];
    const dB = calcParams[1];
    const f = calcParams[2];
    const k = calcParams[3];
    const dynkillfeed = calcParams[4];

    const xNormed = this.thread.x / this.constants.width;
    const yNormed = this.thread.y / this.constants.height;


    const x = addChemicalsParams[0];
    const y = addChemicalsParams[1];
    const radius = addChemicalsParams[2];
    const addChems = addChemicalsParams[3];

    // we calculate k and f deepending on x, y when dynkillfeed = 1
    const kT = mixValues(k, k + (xNormed * 0.025), dynkillfeed);
    const fT = mixValues(f, (f + 0.09) + (yNormed * -0.09), dynkillfeed);

    const laplaceA = calcWeightedSum(grid, 0.0, weights);
    const laplaceB = calcWeightedSum(grid, 1.0, weights);

    const fluidA = grid[0][this.thread.y][this.thread.x];
    const fluidB = grid[1][this.thread.y][this.thread.x] + (addChems * calcFluidBToAdd(grid, x, y, radius));
    const abb = fluidA * fluidB * fluidB;

    const fluid = (this.thread.z - 1) * -calcNextA(fluidA, dA, laplaceA, abb, fT)
      + (this.thread.z * (fluidB + (dB * laplaceB) + abb - ((kT + fT) * fluidB)));

    return limit(fluid, 0, 1);
  }

  return {usedFunctions, calcNextKernel};
})();
