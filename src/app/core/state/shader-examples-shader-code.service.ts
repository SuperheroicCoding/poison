import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { ShaderExamplesShaderCodeStore } from './shader-examples-shader-code.store';
import { ShaderExamplesShaderCodeDataService } from './shader-examples-shader-code-data.service';

@Injectable({
  providedIn: 'root'
})
export class ShaderExamplesShaderCodeService {

  constructor(private shaderExamplesShaderCodeStore: ShaderExamplesShaderCodeStore,
              private shaderExamplesShaderCodeDataService: ShaderExamplesShaderCodeDataService) {
  }

  get() {
    // this.shaderExamplesShaderCodeDataService.get().subscribe((entities: ServerResponse) => {
      // this.shaderExamplesShaderCodeStore.set(entities);
    // });
  }

  add() {
    // this.shaderExamplesShaderCodeDataService.post().subscribe((entity: ServerResponse) => {
      // this.shaderExamplesShaderCodeStore.add(entity);
    // });
  }

}
