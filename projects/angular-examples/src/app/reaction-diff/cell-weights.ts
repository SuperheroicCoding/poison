export interface CellWeights {
  topLeft: number;
  topCenter: number;
  topRight: number;
  left: number;
  center: number;
  right: number;
  bottomLeft: number;
  bottomCenter: number;
  bottomRight: number;
}

export const weightsToArray = (weights) => {
  return [
    weights.topLeft, weights.topCenter, weights.topRight,
    weights.left, weights.center, weights.right,
    weights.bottomLeft, weights.bottomCenter, weights.bottomRight
  ];
};
