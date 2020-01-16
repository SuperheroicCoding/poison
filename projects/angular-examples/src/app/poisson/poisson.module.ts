import {NgModule} from '@angular/core';
import {PoissonComponent} from './poisson.component';
import {PoissonConfigService} from './poisson-config.service';
import {SharedModule} from '../shared/shared.module';
import {SharedModule as PoissonShared} from './shared/shared.module';
import {SimControlsComponent} from './sim-controls/sim-controls.component';
import {FormsModule} from '@angular/forms';
import {PoissonCalcService} from './poisson-calc.service';
import {PoissonRoutingModule} from './poisson-routing.module';
import {CanvasViewModule} from './views/canvas-view/canvas-view.module';

@NgModule({
  declarations: [
    PoissonComponent,
    SimControlsComponent],
  imports: [
    PoissonRoutingModule,
    SharedModule,
    FormsModule,
    CanvasViewModule,
    PoissonShared
  ],
  providers: [PoissonConfigService, PoissonCalcService],
})
export class PoissonModule {
}
