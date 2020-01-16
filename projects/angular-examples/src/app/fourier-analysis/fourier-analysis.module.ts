import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {CircleAnalysisComponent} from './circle-analysis/circle-analysis.component';
import {CircleCanvasComponent} from './circle-analysis/circle-canvas/circle-canvas.component';
import {FourierAnalysisRoutingModule} from './fourier-analysis-routing.module';
import {FourierAnalysisComponent} from './fourier-analysis/fourier-analysis.component';
import {InputWaveComponent} from './input-wave/input-wave.component';
import {WaveCanvasComponent} from './input-wave/wave-canvas/wave-canvas.component';
import {WaveOptionsComponent} from './input-wave/wave-options/wave-options.component';

@NgModule({
  imports: [SharedModule, FourierAnalysisRoutingModule],
  declarations: [FourierAnalysisComponent,
    InputWaveComponent,
    WaveCanvasComponent,
    WaveOptionsComponent,
    CircleAnalysisComponent,
    CircleCanvasComponent]
})
export class FourierAnalysisModule {
}
