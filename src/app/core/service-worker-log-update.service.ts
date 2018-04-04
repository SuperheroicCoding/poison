import {Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {environment} from '../../environments/environment';

@Injectable()
export class ServiceWorkerLogUpdateService {

  constructor(updates: SwUpdate) {
    if (environment.production) {

      updates.available.subscribe(event => {
        console.log('current version is', event.current);
        console.log('available version is', event.available);
      });
      updates.activated.subscribe(event => {
        console.log('old version was', event.previous);
        console.log('new version is', event.current);
      });
    } else {
      console.log('ServiceWorker not used. Because in dev mode!');
    }
  }
}
