const epsilon = 0.0000000001;
const two_pi = 2.0 * Math.PI;
let generate = true;
let z1: number;

export function gaussian(mu: number, sigma: number): number {
  if (!generate) {
    generate = true;
    return z1 * sigma + mu;
  }

  let u1 = 0;
  let u2 = 0;
  while (u1 <= epsilon) {
    u1 = Math.random();
    u2 = Math.random();
    generate = false;
  }

  const sqrtLog = Math.sqrt(-2.0 * Math.log(u1));
  const z0 = sqrtLog * Math.cos(two_pi * u2);
  z1 = sqrtLog * Math.sin(two_pi * u2);
  return z0 * sigma + mu;
}
