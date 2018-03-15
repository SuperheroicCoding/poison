import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {P5ViewComponent} from './p5-view.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [P5ViewComponent],
  exports: [P5ViewComponent]

})
export class P5ViewModule {
}
