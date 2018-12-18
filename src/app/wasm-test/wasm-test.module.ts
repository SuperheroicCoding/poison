import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {WasmTestRoutingModule} from './wasm-test-routing.module';
import {WasmTestComponent} from './wasm-test/wasm-test.component';

@NgModule({
  imports: [SharedModule, WasmTestRoutingModule, ReactiveFormsModule],
  declarations: [WasmTestComponent]
})
export class WasmTestModule {
}
