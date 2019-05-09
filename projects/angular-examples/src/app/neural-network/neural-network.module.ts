import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {NeuralNetworkComponent} from './neural-network.component';
import {BrainService} from './shared/brain.service';
import {TrainDataService} from './shared/train-data.service';
import {PerceptronComponent} from './shared/perceptron/perceptron.component';
import {DataViewComponent} from './shared/data-view/data-view.component';
import {MultiPerceptronComponent} from './multi-perceptron/multi-perceptron.component';
import {PerceptronTabComponent} from './perceptron-tab/perceptron-tab.component';
import {BrainSettingsComponent} from './shared/brain-settings/brain-settings.component';
import {NeuralNetworkRoutingModule} from './neural-network-routing.module';

@NgModule({
  imports: [
    SharedModule,
    NeuralNetworkRoutingModule
  ],
  declarations: [NeuralNetworkComponent,
    PerceptronComponent,
    DataViewComponent,
    MultiPerceptronComponent,
    PerceptronTabComponent,
    BrainSettingsComponent],
  providers: [BrainService, TrainDataService]
})
export class NeuralNetworkModule {

  constructor() {
  }
}
