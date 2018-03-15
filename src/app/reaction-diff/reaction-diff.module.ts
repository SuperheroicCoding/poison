import {NgModule} from '@angular/core';
import {ReactionDiffComponent} from './reaction-diff.component';
import {ReactionDiffCalcServiceFactory} from './reaction-diff-calculation-service.factory';
import {reactionDiffRoutes} from './reaction-diff-routing.module';
import {P5ViewComponent} from './p5-view/p5-view.component';
import {SharedModule} from '../shared/shared.module';
import {WeightsConfigComponent} from './weights-config/weights-config.component';
import {ReactionDiffConfigService} from './reaction-diff-config.service';
import {ColorMapperService} from './color-mapper.service';
import {GpuJsService} from './gpujs.service';

@NgModule({
  imports: [
    reactionDiffRoutes,
    SharedModule,
  ],
  declarations: [ReactionDiffComponent, P5ViewComponent, WeightsConfigComponent],
  exports: [ReactionDiffComponent],
  providers: [ReactionDiffCalcServiceFactory, ReactionDiffConfigService, ColorMapperService, GpuJsService]
})
export class ReactionDiffModule {
}
