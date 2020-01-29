(function () {


  function mixVal(value1, value2, ratio) {
    return (value1 * (1.0 - ratio)) + (value2 * ratio);
  }

  const usedFunctions = [mixVal];

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
    const rb = 0.0;
    const gb = 0.0;
    const bb = bVal * 0.4;

    if (Math.abs(aVal) < 0.001) {
      this.color(
        mixVal(rbg, rb, bVal),
        mixVal(gbg, gb, bVal),
        mixVal(bbg, bb, bVal)
      );
    } else if (Math.abs(bVal) < 0.001) {
      this.color(
        mixVal(rbg, ra, 0.5),
        mixVal(gbg, ga, 0.5),
        mixVal(bbg, ba, 0.5)
      );
    } else if (aVal < bVal) {
      const rel = aVal / bVal;
      this.color(
        mixVal(rb, ra, rel),
        mixVal(gb, ga, rel),
        mixVal(bb, ba, rel)
      );
    } else {
      const rel2 = bVal / aVal;
      this.color(
        mixVal(ra, rb, rel2),
        mixVal(ga, gb, rel2),
        mixVal(ba, bb, rel2)
      );
    }
  }

  return {usedFunctions, imageKernel};
})();

