import {Component, NgZone} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {delay, finalize, flatMap, map, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {UpdateAvailableEvent} from '@angular/service-worker/src/low_level';
import {ServiceWorkerLogUpdateService} from '../core/service-worker-log-update.service';
import {ServiceWorkerUpdateService} from '../core/service-worker-update.service';
import {interval, from} from 'rxjs';


@Component({
  selector: 'app-service-worker-update',
  templateUrl: './service-worker-update.component.html',
  styleUrls: ['./service-worker-update.component.scss']
})
export class ServiceWorkerUpdateComponent {
  private _isLoading = false;
  updatesAvailable = false;


  constructor(private swUpdates: SwUpdate, private  zone: NgZone, updateLogger: ServiceWorkerLogUpdateService, private  updateService: ServiceWorkerUpdateService) {
    if (!environment.production) {
      return;
    }
    updateLogger.startLogging();
    updateService.showSnackOnUpdateAvailable();
    console.log('Service Worker enabled?', this.swUpdates.isEnabled);

    zone.runOutsideAngular(() => {
      interval(environment.serviceWorkerCheckInterval).pipe(
        tap(intervalTime => this.isLoading = true),
        tap(() => console.log('service worker is checking for new update.')),
        flatMap(intervalTime => this.zone.run(() => from(this.swUpdates.checkForUpdate()))),
        delay(200), // to make the spinner visible
        finalize(() => this.isLoading = false)
      )
        .subscribe(
          () => this.isLoading = false,
          (error) => console.error(error));
    });

    swUpdates.available.pipe(
      map((updateEvent: UpdateAvailableEvent) => true)
    )
      .subscribe(available => this.updatesAvailable = available);

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
