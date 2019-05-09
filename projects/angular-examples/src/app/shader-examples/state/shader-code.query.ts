import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ShaderCodeStore, ShaderCodeState } from './shader-code.store';
import { ShaderCode } from './shader-code.model';

@Injectable({
  providedIn: 'root'
})
export class ShaderCodeQuery extends QueryEntity<ShaderCodeState, ShaderCode> {

  constructor(protected store: ShaderCodeStore) {
    super(store);
  }

}
