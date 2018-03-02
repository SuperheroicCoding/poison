import {Injectable} from '@angular/core';
import {Cell} from './cell';

export interface ReactionDiffCellColor {
  r: number;
  g: number;
  b: number;
}

@Injectable()
export class ColorMapperService {

  backgroundColor: ReactionDiffCellColor = {r: 0, g: 0, b: 0};
  savedColors: Array<Array<ReactionDiffCellColor>> = [];

  constructor() {
    for (let x = 0; x < 256; x++) {
      this.savedColors[x] = [];
      for (let y = 0; y < 256; y++) {
        this.savedColors[x][y] = null;
      }
    }
  }


  calcColorFor(cell: Cell, p: any): ReactionDiffCellColor {
    if (isNaN(cell.a) || isNaN(cell.b)) {
      return this.backgroundColor;
    }
    const a = Math.floor(cell.a * 255);
    const b = Math.floor(cell.b * 255);
    let result = this.savedColors[a][b];
    if (!result) {
      const pCalcedColor = this.calcColor(a, b, p);
      result = {r: p.red(pCalcedColor), g: p.green(pCalcedColor), b: p.blue(pCalcedColor)};
      this.savedColors[a][b] = result;
    }
    return result;
  }

  private calcColor(a: number, b: number, p: any): any {
    const backgroundColor = p.color(this.backgroundColor.r, this.backgroundColor.g, this.backgroundColor.b);
    const aColor = p.color(a, a, 204);
    const bColor = p.color(0, 0, p.map(b, 0, 255, 0, 102));

    if (a === 0) {
      return p.lerpColor(backgroundColor, bColor, b / 255);
    }
    if (b === 0) {
      return p.lerpColor(backgroundColor, aColor, 0.5);
    }

    if (a === b) {
      return p.lerpColor(aColor, bColor, .5);
    }
    if (a > b) {
      return p.lerpColor(aColor, bColor, b / a);
    }
    return p.lerpColor(bColor, aColor, a / b);
  }


}
