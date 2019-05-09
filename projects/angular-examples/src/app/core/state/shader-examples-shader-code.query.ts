import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ShaderExamplesShaderCodeStore, ShaderExamplesShaderCodeState } from './shader-examples-shader-code.store';
import { ShaderExamplesShaderCode } from './shader-examples-shader-code.model';

@Injectable({
  providedIn: 'root'
})
export class ShaderExamplesShaderCodeQuery extends QueryEntity<ShaderExamplesShaderCodeState, ShaderExamplesShaderCode> {

  constructor(protected store: ShaderExamplesShaderCodeStore) {
    super(store);
  }

}
