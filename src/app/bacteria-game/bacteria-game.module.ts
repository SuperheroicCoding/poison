import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {bacteriaGameRoutingModule} from './bacteria-game-routing.module';
import { BacteriaGameComponent } from './bacteria-game.component';

@NgModule({
  imports: [ SharedModule, bacteriaGameRoutingModule ],
  declarations: [ BacteriaGameComponent ]
})
export class BacteriaGameModule { }
