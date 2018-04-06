import {Component, NgZone} from '@angular/core';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {SwUpdate} from '@angular/service-worker';
import {delay, finalize, flatMap, map, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {UpdateAvailableEvent} from '@angular/service-worker/src/low_level';
import {ServiceWorkerLogUpdateService} from '../core/service-worker-log-update.service';
import {ServiceWorkerUpdateService} from '../core/service-worker-update.service';


@Component({
  selector: 'app-service-worker-update',
  templateUrl: './service-worker-update.component.html',
  styleUrls: ['./service-worker-update.component.less']
})
export class ServiceWorkerUpdateComponent {
  private _isLoading = false;
  updatesAvailable = false;


  constructor(private swUpdates: SwUpdate, private  zone: NgZone, updateLogger: ServiceWorkerLogUpdateService, private  updateService: ServiceWorkerUpdateService) {
    if (environment.production) {
      updateLogger.startLogging();
      updateService.showSnackOnUpdateAvailable();
      swUpdates.available.pipe(
        map((updateEvent: UpdateAvailableEvent) => true)
      )
        .subscribe(available => this.updatesAvailable = available);

      zone.runOutsideAngular(() => {
        IntervalObservable.create(environment.serviceWorkerCheckInterval).pipe(
          tap(intervalTime => this.isLoading = true),
          flatMap(intervalTime => this.swUpdates.checkForUpdate()),
          delay(200), // to make the spinner visible
          finalize(() => this.isLoading = false)
        )
          .subscribe(
            () => this.isLoading = false,
            (error) => console.error(error));
      });
    }
  }

  get isLoading() {
    return this._isLoading;
  }

  set isLoading(isLoading: boolean) {
    this.zone.run(() => this._isLoading = isLoading);
  }

  activateUpdate() {
    this.updateService.activateUpdate();
  }

}
