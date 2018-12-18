import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WasmTestComponent} from './wasm-test/wasm-test.component';

const routes: Routes = [{
  path: '', component: WasmTestComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WasmTestRoutingModule {
}
