(function () {

  function mixValues(value1, value2, ratio) {
    return (value1 * (1.0 - ratio)) + (value2 * ratio);
  }

  const usedFunctions = [mixValues];

  function imageKernel(grid) {

    const aVal = grid[0][this.thread.y][this.thread.x];
    const bVal = grid[1][this.thread.y][this.thread.x];

    // background color
    const rbg = 0.1;
    const gbg = 0.25;
    const bbg = 0.1;

    // a color
    const ra = aVal;
    const ga = aVal;
    const ba = 0.8;

    // b color
    const rb = 0.;
    const gb = 0.;
    const bb = bVal * 0.4;

    if (aVal === 0.) {
      this.color(
        mixValues(rbg, rb, bVal),
        mixValues(gbg, gb, bVal),
        mixValues(bbg, bb, bVal));
    } else if (bVal === 0.) {
      this.color(
        mixValues(rbg, ra, 0.5),
        mixValues(gbg, ga, 0.5),
        mixValues(bbg, ba, 0.5));
    } else if (aVal < bVal) {
      const rel = aVal / bVal;
      this.color(
        mixValues(rb, ra, rel),
        mixValues(gb, ga, rel),
        mixValues(bb, ba, rel)
      );
    } else {
      const rel2 = bVal / aVal;
      this.color(
        mixValues(ra, rb, rel2),
        mixValues(ga, gb, rel2),
        mixValues(ba, bb, rel2)
      );
    }

  }

  return {usedFunctions, imageKernel};
})();

