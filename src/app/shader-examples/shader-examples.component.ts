import {Component, OnInit} from '@angular/core';
import {ShaderDef, shaders} from './shaders';

@Component({
  selector: 'app-shader-examples',
  templateUrl: './shader-examples.component.html',
  styleUrls: ['./shader-examples.component.less']
})
export class ShaderExamplesComponent implements OnInit {
  shaders: ShaderDef[];
  private showFps: boolean;

  constructor() {
  }

  ngOnInit() {
    this.shaders = shaders;
    this.showFps = false;
  }

}
