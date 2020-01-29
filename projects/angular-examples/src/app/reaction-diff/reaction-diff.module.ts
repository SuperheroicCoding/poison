import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ReactionDiffComponent} from './reaction-diff.component';
import {ReactionDiffCalcServiceFactory} from './reaction-diff-calculation-service.factory';
import {ReactionDiffRoutingModule} from './reaction-diff-routing.module';
import {P5ViewComponent} from './p5-view/p5-view.component';
import {SharedModule} from '../shared/shared.module';
import {WeightsConfigComponent} from './weights-config/weights-config.component';
import {ReactionDiffConfigService} from './reaction-diff-config.service';
import {ColorMapperService} from './color-mapper.service';
import {GpuJsService} from '../core/gpujs.service';
import {LoadGpuKernelsResolver} from './load-gpu-kernels.resolver';

@NgModule({
  imports: [
    ReactionDiffRoutingModule,
    SharedModule,
    HttpClientModule,
  ],
  declarations: [ReactionDiffComponent, P5ViewComponent, WeightsConfigComponent],
  exports: [ReactionDiffComponent],
  providers: [ReactionDiffCalcServiceFactory, ReactionDiffConfigService, ColorMapperService, GpuJsService, LoadGpuKernelsResolver]
})
export class ReactionDiffModule {

}
