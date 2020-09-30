import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NeuralNetworkComponent} from './neural-network.component';
import {MultiPerceptronComponent} from './multi-perceptron/multi-perceptron.component';
import {PerceptronTabComponent} from './perceptron-tab/perceptron-tab.component';


const routes: Routes = [{
  path: '', component: NeuralNetworkComponent, children: [
    {path: 'perceptron', component: PerceptronTabComponent},
    {path: 'multiPerceptron', component: MultiPerceptronComponent},
    {path: '', pathMatch: 'full', redirectTo: 'perceptron'}
  ]
}];

export const navLinks = routes.filter(route => route.path.length > 0);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NeuralNetworkRoutingModule {
}
