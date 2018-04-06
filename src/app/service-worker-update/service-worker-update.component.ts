import {Component, NgZone, OnInit} from '@angular/core';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {SwUpdate} from '@angular/service-worker';
import {delay, finalize, flatMap, map, publishBehavior, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {UpdateAvailableEvent} from '@angular/service-worker/src/low_level';
import {ServiceWorkerLogUpdateService} from '../core/service-worker-log-update.service';


@Component({
  selector: 'app-service-worker-update',
  templateUrl: './service-worker-update.component.html',
  styleUrls: ['./service-worker-update.component.less']
})
export class ServiceWorkerUpdateComponent implements OnInit {
  private _isLoading = false;
  updatesAvailable: Observable<boolean>;


  constructor(private updates: SwUpdate, private  zone: NgZone, updateLogger: ServiceWorkerLogUpdateService) {
    if (environment.production) {
      updateLogger.startLogging();
      this.updatesAvailable = updates.available.pipe(
        map((updateEvent: UpdateAvailableEvent) => true),
        publishBehavior(false));

      zone.runOutsideAngular(() => {
        IntervalObservable.create(environment.serviceWorkerCheckInterval).pipe(
          tap(intervalTime => this.isLoading = true),
          flatMap(intervalTime => this.updates.checkForUpdate()),
          delay(200), // to make the spinner visible
          finalize(() => this.isLoading = false)
        )
          .subscribe(
            () => this.isLoading = false,
            (error) => console.error(error));
      });
    }
  }

  ngOnInit() {
  }

  get isLoading() {
    return this._isLoading;
  }

  set isLoading(isLoading: boolean) {
    this.zone.run(() => this._isLoading = isLoading);
  }

  activateUpdate() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }

}
