import {Directive, ElementRef, EventEmitter, Inject, NgZone, OnDestroy, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {ScThanosService} from './sc-thanos.service';

@Directive({
  selector: '[scThanos]',
  exportAs: 'thanos'
})
export class ScThanosDirective implements OnDestroy {

  private subscription: Subscription;

  @Output()
  private scThanosComplete: EventEmitter<void> = new EventEmitter<void>();

  constructor(private vaporizeDomElem: ElementRef<HTMLElement>, private thanosService: ScThanosService,
              @Inject(NgZone) private _ngZone: NgZone) {
  }

  vaporize(removeElem: boolean = true): void {
    const elem = this.vaporizeDomElem.nativeElement;
    this.subscription = this.thanosService.vaporize(elem).subscribe({
      complete: () => {
        this._ngZone.run(() => {
          if (removeElem) {
            elem.remove();
          } else {
            elem.style.transition = 'opacity 700ms';
            elem.style.opacity = '1';
          }
          this.scThanosComplete.emit();
        });
      },
      error: (error) => {
        console.log('error emitted by vaporize', error);
        this.scThanosComplete.emit();
        throw error;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
