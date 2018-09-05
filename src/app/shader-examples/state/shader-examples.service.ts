import {Injectable} from '@angular/core';
import {ShaderExamplesUIStore} from './shader-examples.store';

@Injectable({
  providedIn: 'root'
})
export class ShaderExamplesService {

  constructor(private shaderExamplesUIStore: ShaderExamplesUIStore) {
  }

  toggleShowFps() {
    this.shaderExamplesUIStore.update(state => ({
      showFps: !state.showFps
    }));
  }

  toggleShowEditor() {
    this.shaderExamplesUIStore.update(state => ({
      showCodeEditor: !state.showCodeEditor
    }));
  }

}
