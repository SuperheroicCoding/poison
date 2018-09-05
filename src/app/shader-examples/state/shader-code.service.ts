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

  add() {
    // this.shaderCodeDataService.post().subscribe((entity: ServerResponse) => {
    // this.shaderCodeStore.add(entity);
    // });
  }

}
