import {Injectable} from '@angular/core';
import {Query} from '@datorama/akita';
import {ShaderExampleState, ShaderExamplesUIStore} from './shader-examples.store';

@Injectable({
  providedIn: 'root'
})
export class ShaderExamplesUIQuery extends Query<ShaderExampleState> {

  showFps = this.select(session => session.showFps);
  showCodeEditor = this.select(session => session.showCodeEditor);
  currentPage = this.select(session => session.currentPage);
  isSmallScreen = this.select(session => session.isSmallScreen);
  pagedShaders = this.select(session => session.pagedShaders);
  animationState = this.select(session => session.animationState);
  savingShader = this.select(session => session.savingShader);

  constructor(protected store: ShaderExamplesUIStore) {
    super(store);
  }

  selectProp(key: keyof ShaderExampleState) {
    return this.select(session => session[key]);
  }

}
