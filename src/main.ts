import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import 'hammerjs';
import {enableAkitaProdMode, persistState} from '@datorama/akita';

if (environment.production) {
  enableProdMode();
  enableAkitaProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
persistState({exclude: ['performance-test', 'wasm-test']});
