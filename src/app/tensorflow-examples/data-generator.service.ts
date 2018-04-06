import {Injectable} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {Rank, Tensor} from '@tensorflow/tfjs';

@Injectable()
export class DataGeneratorService {

  constructor() {
  }

  generateData(numPoints: number, coeff: { a: number, b: number, c: number, d: number }, sigma = 0.04): { xs: Tensor, ys: Tensor } {
    return tf.tidy(
      () => {
        const [a, b, c, d] = [
          tf.scalar(coeff.a), tf.scalar(coeff.b), tf.scalar(coeff.c),
          tf.scalar(coeff.d)
        ];

        const xs: Tensor<Rank.R1> = tf.randomUniform<Rank.R1>([numPoints], -1, 1);

        // Generate polynomial data
        const three = tf.scalar(3, 'int32');
        const ys: Tensor = a.mul(xs.pow(three))
          .add(b.mul(xs.square()))
          .add(c.mul(xs))
          .add(d)
          // Add random noise to the generated data
          // to make the problem a bit more interesting
          .add(tf.randomNormal([numPoints], 0, sigma));

        // Normalize the y values to the range 0 to 1.
        const ymin = ys.min();
        const ymax = ys.max();
        const yrange = ymax.sub(ymin);
        const ysNormalized = ys.sub(ymin).div(yrange);

        return {
          xs,
          ys: ysNormalized
        };
      }
    )
      ;
  }
}
