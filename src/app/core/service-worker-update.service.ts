import {Injectable} from '@angular/core';

import {MatSnackBar} from '@angular/material';
import {SwUpdate} from '@angular/service-worker';
import {environment} from '../../environments/environment';

@Injectable()
export class ServiceWorkerUpdateService {
  constructor(private swUpdate: SwUpdate, private snackbar: MatSnackBar) {
  }

  showSnackOnUpdateAvailable() {
    if (!environment.production) {
      return;
    }
    this.swUpdate.available.subscribe(evt => {
      const snack = this.snackbar.open('Update Available', 'Reload', {
        duration: 6000, horizontalPosition: 'center', verticalPosition: 'bottom'
      });
      snack.onAction()
        .subscribe(() => {
          this.activateUpdate().then(() => snack.dismiss());
        });
    });
  }

  activateUpdate() {
    return this.swUpdate.activateUpdate().then(() => document.location.reload());
  }
}
