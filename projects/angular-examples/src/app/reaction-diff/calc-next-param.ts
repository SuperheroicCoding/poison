import {CellWeights} from './cell-weights';

export interface CalcNextParam {
  width: number;
  height: number;
  gridBuffer: ArrayBufferLike;
  dA: number;
  dB: number;
  f: number;
  k: number;
  dynamicKillFeed: boolean;
  w: CellWeights;
  offsetRow: number;
  offsetLength: number;
}
