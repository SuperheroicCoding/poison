import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {WasmTestRoutingModule} from './wasm-test-routing.module';
import {WasmTestComponent} from './wasm-test/wasm-test.component';

@NgModule({
  imports: [SharedModule, WasmTestRoutingModule],
  declarations: [WasmTestComponent]
})
export class WasmTestModule {
}
