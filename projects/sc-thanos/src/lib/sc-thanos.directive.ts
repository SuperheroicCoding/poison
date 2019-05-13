import {Directive, ElementRef, Inject, NgZone, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {ScThanosService} from './sc-thanos.service';

@Directive({
  selector: '[scThanos]',
})
export class ScThanosDirective implements OnDestroy {

  private subscription: Subscription;

  constructor(private vaporizeDomElem: ElementRef<HTMLElement>, private thanosService: ScThanosService,
              @Inject(NgZone) private _ngZone: NgZone) {
  }

  vaporize(): void {
    const elem = this.vaporizeDomElem.nativeElement;
    this.subscription = this.thanosService.vaporize(elem).subscribe({
      complete: () => {
        this._ngZone.run(() => {
          elem.parentElement.removeChild(elem);
          return;
        });
      },
      error: (error) => {
        console.log('error emitted by vaporize', error);
        throw error;
      }
    });
  }

  ngOnDestroy(): void {
    console.log('destroy vaporize directive');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
