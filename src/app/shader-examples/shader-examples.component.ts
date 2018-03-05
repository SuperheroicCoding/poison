import {Component, OnInit} from '@angular/core';
import {ShaderDef, shaders} from './shaders';

interface ShaderModel extends ShaderDef {
  fullSize: boolean;
}

@Component({
  selector: 'app-shader-examples',
  templateUrl: './shader-examples.component.html',
  styleUrls: ['./shader-examples.component.less']
})
export class ShaderExamplesComponent implements OnInit {
  shaders: ShaderModel[];
  private showFps: boolean;

  constructor() {
  }

  ngOnInit() {
    this.shaders = shaders.map((shader: ShaderDef) => Object.assign({fullSize: false}, shader));
    this.showFps = false;
  }

}
