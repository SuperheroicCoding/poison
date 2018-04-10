import {NgModule} from '@angular/core';
import {ShaderExamplesComponent} from './shader-examples.component';

import {ShaderExamplesRoutingModule} from './shader-examples-routing.module';
import {SharedModule} from '../shared/shared.module';
import {MatPaginatorModule} from '@angular/material';
import * as Hammer from 'hammerjs';
import {HammerGestureConfig} from '@angular/platform-browser';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    // override hammerjs default configuration
    'swipe': {direction: Hammer.DIRECTION_ALL}
  }
}

@NgModule({
  imports: [
    SharedModule,
    ShaderExamplesRoutingModule,
    MatPaginatorModule
  ],
  declarations: [ShaderExamplesComponent]
})
export class ShaderExamplesModule {
}
