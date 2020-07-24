import {Injectable} from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Injectable({providedIn: 'root'})
export class DataGeneratorService {

  constructor() {
  }

  generateData(numPoints: number,
               coeff: { a: number, b: number, c: number, d: number }, sigma = 0.125):
    { xs: tf.Tensor<tf.Rank.R1>, ys: tf.Tensor<tf.Rank.R1> } {
    return tf.tidy(
      () => {
        const [a, b, c, d]: tf.Tensor<tf.Rank.R0>[] = [
          tf.scalar(coeff.a), tf.scalar(coeff.b), tf.scalar(coeff.c),
          tf.scalar(coeff.d)
        ];

        const xs = tf.randomUniform([numPoints], -1, 1);

        // Generate polynomial data
        const three = tf.scalar(3, 'int32');
        const ys = a.mul(xs.pow(three as tf.Tensor))
          .add(b.mul(xs.square()))
          .add(c.mul(xs as tf.Tensor))
          .add(d as tf.Tensor)
          // Add random noise to the generated data
          // to make the problem a bit more interesting
          .add(tf.randomNormal([numPoints], 0, sigma) as tf.Tensor);

        // Normalize the y values to the range 0 to 1.
        const ymin = ys.min();
        const ymax = ys.max();
        const yrange = ymax.sub(ymin);
        const ysNormalized = ys.sub(ymin).div(yrange);
        return {
          xs,
          ys: ysNormalized
        } as any;
      }
    );
  }
}

