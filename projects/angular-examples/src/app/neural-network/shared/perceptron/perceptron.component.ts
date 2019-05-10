import {AfterContentInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {Perceptron} from '../perceptron';
import * as p5 from 'p5';

@Component({
  selector: 'app-perceptron',
  templateUrl: './perceptron.component.html',
  styleUrls: ['./perceptron.component.css']
})
export class PerceptronComponent implements AfterContentInit, OnDestroy {

  @Input() perceptron: Perceptron;
  @Input() canvasHeight ? = 300;
  @Input() canvasWidth ? = 300;
  @ViewChild('perceptronCanvas', { static: true }) perceptronCanvas: ElementRef;
  private scetch: p5;

  static roundFloat(input: number) {
    return input.toFixed(5);
  }

  constructor() {
  }

  ngAfterContentInit(): void {

    this.scetch = new p5((p: p5) => {
      p.setup = () => {
        p.createCanvas(this.canvasWidth, this.canvasHeight);
      };
      p.draw = () => {
        p.background(255);
        this.drawPerceptronCircle(p);
        this.drawBiasInput(p);
        this.drawInputs(p);
      };
    }, this.perceptronCanvas.nativeElement);
  }

  ngOnDestroy(): void {
    this.scetch.remove();
  }

  drawPerceptronCircle(p: p5) {
    p.push();
    p.translate(this.perceptronCircleX(), this.canvasHeight / 2);
    this.perceptron.isLearning ? p.fill(255, 200, 200) : p.fill(200, 200, 255);

    const circleSize = this.perceptronCircleSize();
    p.ellipse(0, 0, circleSize, circleSize);
    p.fill(0, 0, 0);
    p.textSize(circleSize / 2.5);
    p.textAlign(p.CENTER);
    p.text('∑', 0, circleSize / 10);

    p.line(circleSize / 2, 0, this.canvasWidth / 3, 0);
    if (this.perceptron.lastGuess != null) {
      p.textSize(circleSize / 4);
      p.textAlign(p.LEFT);
      p.text('Output:' + PerceptronComponent.roundFloat(this.perceptron.lastGuess), circleSize / 2 + 2, -2);
    }
    p.pop();
  }

  private perceptronCircleX() {
    return this.canvasWidth / 2 + this.canvasWidth / 30;
  }

  private perceptronCircleSize() {
    return this.canvasWidth / 6;
  }

  drawBiasInput(p: p5) {
    p.push();
    p.translate(this.perceptronCircleX(), this.canvasHeight / 12);
    this.perceptron.isLearning ? p.fill(255, 200, 200) : p.fill(200, 200, 255);
    const circleSize = this.canvasWidth / 7.5;
    p.ellipse(0, 0, circleSize, circleSize);
    p.fill(0, 0, 0);
    p.textSize(circleSize / 3.5);
    p.textAlign(p.CENTER);
    p.text('Bias', 0, circleSize / 10);
    p.textAlign(p.LEFT);
    p.text(PerceptronComponent.roundFloat(this.perceptron.bias), 5, this.canvasHeight / 10);
    p.line(0, circleSize / 2, 0, this.canvasHeight / 3);
    p.pop();
  }

  drawInputs(p: p5) {
    const inputDistanceY = (this.canvasHeight) / (this.perceptron.weights.length + 1);
    this.perceptron.weights.forEach((weight, index) => {
      const y = inputDistanceY * (index + 1);
      const circleSize = this.canvasWidth / 7.5;

      const circleX = this.canvasWidth / 12;
      p.ellipse(circleX, y, circleSize, circleSize);
      p.textAlign(p.CENTER);
      p.textSize(circleSize / 3.5);
      p.text('Input ' + (index + 1), circleX, y + 4);
      p.line(circleX + circleSize / 2, y, this.perceptronCircleX() - this.perceptronCircleSize() / 2, this.canvasHeight / 2);
      p.textAlign(p.LEFT);
      if (this.perceptron.lastInput != null) {
        p.text(
          `in${index + 1}: ${PerceptronComponent.roundFloat(this.perceptron.lastInput[index])}`,
          circleX * 2,
          y - this.perceptronCircleSize() / 4);
      }
      p.text(`w${index + 1}: ${PerceptronComponent.roundFloat(weight)}`, circleX * 2, y + this.perceptronCircleSize() / 2);
    });
  }

}

