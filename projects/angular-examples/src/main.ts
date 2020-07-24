import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {enableAkitaProdMode, persistState} from '@datorama/akita';

if (environment.production) {
  enableProdMode();
  enableAkitaProdMode();
}

// persistState({exclude: ['performance-test', 'wasm-test', 'input-wave', 'game-state', 'bacteria-player']});
platformBrowserDynamic().bootstrapModule(AppModule);
