import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ShaderExamplesShaderCode } from './shader-examples-shader-code.model';

export interface ShaderExamplesShaderCodeState extends EntityState<ShaderExamplesShaderCode> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shader-examples/shader-code' })
export class ShaderExamplesShaderCodeStore extends EntityStore<ShaderExamplesShaderCodeState, ShaderExamplesShaderCode> {

  constructor() {
    super();
  }

}

