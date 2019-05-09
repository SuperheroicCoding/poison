import {Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {environment} from '../../environments/environment';

@Injectable()
export class ServiceWorkerLogUpdateService {

  constructor(private updates: SwUpdate) {
  }

  startLogging() {
    if (!environment.production) {
      console.log('ServiceWorker not used. Because in dev mode!');
      return;
    }

    this.updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
    });
    this.updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
  }


}
