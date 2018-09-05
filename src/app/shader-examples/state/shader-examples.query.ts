import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ShaderExamplesUIStore, ShaderExampleState } from './shader-examples.store';

@Injectable({
  providedIn: 'root'
})
export class ShaderExamplesUIQuery extends Query<ShaderExampleState> {

  showFps = this.select(session => session.showFps);
  showCodeEditor = this.select(session => session.showCodeEditor);

  constructor(protected store: ShaderExamplesUIStore) {
    super(store);
  }

}
