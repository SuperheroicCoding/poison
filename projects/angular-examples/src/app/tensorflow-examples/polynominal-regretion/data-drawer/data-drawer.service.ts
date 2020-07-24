import {Injectable} from '@angular/core';
import {Tensor} from '@tensorflow/tfjs';
import renderChart from 'vega-embed';


@Injectable({providedIn: 'root'})
export class DataDrawerService {

  constructor() {
  }

  async plotData(element, data: { xs: Tensor, ys: Tensor }) {
    const xvals = await data.xs.data();
    const yvals = await data.ys.data();

    const values = Array.from(yvals).map((y, i) => {
      return {'x': xvals[i], 'y': yvals[i]};
    });

    const spec: any = {
      '$schema': 'https://vega.github.io/schema/vega-lite/v4.4.0.json',
      'width': 300,
      'height': 300,
      'data': {'values': values},
      'mark': {'type': 'point', 'orient': 'vertical'},
      'encoding': {
        'x': {'field': 'x', 'type': 'quantitative'},
        'y': {'field': 'y', 'type': 'quantitative'}
      }
    };

    return renderChart(element, spec, {actions: false});
  }

  async plotDataAndPredictions(container, data: { xs: Tensor, ys: Tensor }, preds: Tensor) {
    const xvals = await data.xs.data();
    const yvals = await data.ys.data();
    const predVals = await preds.data();

    const values = Array.from(yvals).map((y, i) => {
      return {'x': xvals[i], 'y': yvals[i], pred: predVals[i]};
    });

    const spec: any = {
      '$schema': 'https://vega.github.io/schema/vega-lite/v4.4.0.json',
      'width': 300,
      'height': 300,
      'data': {'values': values},
      'layer': [
        {
          'mark': {'type': 'point', 'orient': 'vertical'},
          'encoding': {
            'x': {'field': 'x', 'type': 'quantitative'},
            'y': {'field': 'y', 'type': 'quantitative'}
          }
        },
        {
          'mark': {'type': 'line', 'orient': 'vertical'},
          'encoding': {
            'x': {'field': 'x', 'type': 'quantitative'},
            'y': {'field': 'pred', 'type': 'quantitative'},
            'color': {'value': 'tomato'}
          },
        }
      ]
    };

    return renderChart(container, spec, {actions: false});
  }

  renderCoefficients(container, coeff) {

    container.innerHTML =
      `<span>a=${coeff.a.toFixed(3)}, b=${coeff.b.toFixed(3)}, c=${
        coeff.c.toFixed(3)},  d=${coeff.d.toFixed(3)}</span>`;
  }



}
