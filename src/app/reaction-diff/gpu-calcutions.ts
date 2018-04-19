
export const whenEq = function(x: number, y: number): number {
  return 1.0 - Math.abs(this.sign(x - y));
};

export const whenNeq = function(x: number, y: number): number {
  return Math.abs(this.sign(x - y));
};

export const whenGt = function(x: number, y: number): number {
  return Math.max(this.sign(x - y), 0.0);
};

export const whenLt = function(x: number, y: number): number {
  return Math.max(this.sign(y - x), 0.0);
};

export const whenGe = function(x: number, y: number): number {
  return 1.0 - whenLt(x, y);
};

export const whenLe = function(x: number, y: number): number {
  return 1.0 - whenGt(x, y);
};

export const and = function(a: number, b: number): number {
  return a * b;
};

export const or = function(a: number, b: number): number {
  return this.min(a + b, 1.0);
};

export const xor = function(a: number, b: number): number {
  return (a + b) % 2.0;
};

export const not = function(a: number): number {
  return 1.0 - a;
};
