import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {BacteriaGameRoutingModule} from './bacteria-game-routing.module';
import {BacteriaGameComponent} from './bacteria-game.component';
import {WinnerComponent} from './winner-info/winner.component';

@NgModule({
  imports: [SharedModule, BacteriaGameRoutingModule],
  declarations: [BacteriaGameComponent, WinnerComponent],
})
export class BacteriaGameModule {
}
