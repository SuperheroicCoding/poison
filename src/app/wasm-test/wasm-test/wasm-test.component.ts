import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, RequiredValidator, Validators} from '@angular/forms';
import {REQUIRED_VALIDATOR} from '@angular/forms/src/directives/validators';
import {ID, PersistNgFormPlugin} from '@datorama/akita';
import {Observable, Subscription} from 'rxjs';
import {WasmTestService} from '../state/wasm-test.service';
import {WasmTestQuery} from '../state/wasm-test.query';
import {FibResult} from '../state/wasm-test.store';

class WasmTest {
}

@Component({
  selector: 'app-wasm-test',
  templateUrl: './wasm-test.component.html',
  styleUrls: ['./wasm-test.component.scss']
})
export class WasmTestComponent implements OnInit, OnDestroy {
  fibRunning$: Observable<boolean>;
  fibResult$: Observable<FibResult>;
  fibN$: Observable<number>;
  isLoading$: Observable<boolean>;
  fibOptionsForm: FormGroup;
  private persistForm: PersistNgFormPlugin<any>;
  private subscription: Subscription;

  constructor(private wasmTestQuery: WasmTestQuery,
              private wasmTestService: WasmTestService,
              private builder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.fibRunning$ = this.wasmTestQuery.selectFibRunning();
    this.fibN$ = this.wasmTestQuery.selectFibN();
    this.fibResult$ = this.wasmTestQuery.selectFibResult();
    this.isLoading$ = this.wasmTestQuery.selectLoading();

    this.fibOptionsForm = this.builder.group({
      fibN: this.builder.control(
        this.wasmTestQuery.getSnapshot().fibOptions.fibN,
        [Validators.min(0), Validators.max(45), Validators.required]),
    });

    this.persistForm = new PersistNgFormPlugin(
      this.wasmTestQuery,
      'fibOptions')
      .setForm(this.fibOptionsForm);

    this.subscription =
      this.fibRunning$.subscribe(fibRunning =>
        fibRunning ? this.fibOptionsForm.controls['fibN'].disable() : this.fibOptionsForm.controls['fibN'].enable()
      );
  }

  calcFib() {
    this.wasmTestService.startFibCalc();
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
    this.persistForm && this.persistForm.destroy();
  }
}
