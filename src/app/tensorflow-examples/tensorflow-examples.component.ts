import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-tensorflow-examples',
  templateUrl: './tensorflow-examples.component.html',
  styleUrls: ['./tensorflow-examples.component.less']
})
export class TensorflowExamplesComponent implements OnInit {

  navLinks = [
    {path: 'polynominalregretion', label: 'Polynominal regretion'},
    {path: 'learnedDigits', label: 'Learned digits (MNIST)', hidden: !environment.production}
  ];

  constructor() { }

  ngOnInit() {
  }

}
