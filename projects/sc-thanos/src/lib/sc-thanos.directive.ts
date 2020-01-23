import {Directive, ElementRef, EventEmitter, Inject, NgZone, OnDestroy, Output} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {SC_THANOS_OPTIONS_TOKEN, ScThanosOptions} from './sc-thanos.options';
import {ScThanosService} from './sc-thanos.service';

@Directive({
  selector: 'sc-thanos, [scThanos]',
  exportAs: 'thanos'
})
export class ScThanosDirective implements OnDestroy {

  private subscription: Subscription;

  @Output()
  private scThanosComplete: EventEmitter<void> = new EventEmitter<void>();

  constructor(private vaporizeDomElem: ElementRef<HTMLElement>, private thanosService: ScThanosService,
              @Inject(SC_THANOS_OPTIONS_TOKEN) private thanosOptions: ScThanosOptions,
              @Inject(NgZone) private _ngZone: NgZone) {
  }

  vaporize(removeElem: boolean = true): Observable<void> {
    const elem = this.vaporizeDomElem.nativeElement;
    this.subscription = this.thanosService.vaporize(elem)
      .subscribe({
        complete: () => {
          this._ngZone.run(() => {
            if (removeElem) {
              elem.remove();
            } else {
              // make visible again
              elem.style.transition = 'opacity 700ms';
              elem.style.opacity = '1';
            }
            this.scThanosComplete.emit();
          });
        },
        error: (error) => {
          console.log('error emitted by vaporize', error);
          this.scThanosComplete.emit();
        }
      });

    return this.scThanosComplete.asObservable();
  }

  ngOnDestroy(): void {
    console.log('ondestroy');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
