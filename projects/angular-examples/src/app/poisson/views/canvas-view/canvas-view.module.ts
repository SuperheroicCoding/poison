import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CanvasViewComponent} from './canvas-view.component';
import {CanvasDrawService} from './canvas-draw.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [CanvasDrawService],
  declarations: [CanvasViewComponent],
  exports: [CanvasViewComponent]
})
export class CanvasViewModule {
}
