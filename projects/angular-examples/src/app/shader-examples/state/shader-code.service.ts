import {Injectable} from '@angular/core';
import {ShaderCodeStore} from './shader-code.store';
import {ShaderCodeDataService} from './shader-code-data.service';
import {ShaderCode} from './shader-code.model';

@Injectable({
  providedIn: 'root'
})
export class ShaderCodeService {

  constructor(private shaderCodeStore: ShaderCodeStore,
              private shaderCodeDataService: ShaderCodeDataService) {
  }

  get() {
      this.shaderCodeDataService.streamShaders().subscribe((entities: ShaderCode[]) => {
        this.shaderCodeStore.set(entities);
      });
  }

  async update(shader: ShaderCode, code: string) {
      this.shaderCodeStore.update(shader.id, {code});
      return this.shaderCodeDataService.updateShader(shader, code);
  }
}
