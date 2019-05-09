import {TrainData} from './train-data';

export type LabelClass = 0 | 1;

export class Point {
  private _label: LabelClass;

  constructor(private x: number = Math.random(),
              private y: number = Math.random(),
              private _labelDefinition = (in1, in2) => in1 > in2 ? 1 : 0) {
  }

  get label(): LabelClass {
    if (this._label == null) {
      return this._labelDefinition(this.x, this.y);
    }
    return this._label;
  }

  set labelDefinition(labelDef: (in1: number, in2: number) => LabelClass) {
    this._label = null;
    this._labelDefinition = labelDef;
  }

  get data(): number[] {
    return [this.x, this.y];
  }

  get trainData(): TrainData {
    return new TrainData(this.data, this.label);
  }

  show(p: any) {
    p.stroke(0);
    p.fill(this.label === 1 ? p.color(255, 255, 0) : p.color(0, 0, 255));
    p.ellipse(this.x * p.width, this.y * p.height, 8, 8);
  }

  showForResult(p: any, result: LabelClass) {
    p.noStroke();
    if (result === this.label) {
      p.fill(0, 255, 0);
    } else {
      p.fill(255, 0, 0);
    }
    p.ellipse(this.x * p.width, this.y * p.height, 4, 4);
  }
}
