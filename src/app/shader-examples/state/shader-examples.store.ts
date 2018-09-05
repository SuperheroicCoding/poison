import {Injectable} from '@angular/core';
import {Store, StoreConfig} from '@datorama/akita';

export interface ShaderExampleState {
  showFps: boolean;
  showCodeEditor: boolean;
}

export function createInitialShaderExampleState(): ShaderExampleState {
  return {
    showFps: false,
    showCodeEditor: false
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'shader-examples'})
export class ShaderExamplesUIStore extends Store<ShaderExampleState> {

  constructor() {
    super(createInitialShaderExampleState());
  }

}

