import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {bacteriaGameRoutingModule} from './bacteria-game-routing.module';
import {BacteriaGameComponent} from './bacteria-game.component';
import {WinnerComponent} from './winner-info/winner.component';

@NgModule({
  imports: [SharedModule, bacteriaGameRoutingModule],
  declarations: [BacteriaGameComponent, WinnerComponent],
  entryComponents: [WinnerComponent]
})
export class BacteriaGameModule {
}
