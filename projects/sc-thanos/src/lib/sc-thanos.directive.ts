import {Directive, ElementRef, NgZone, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {ScThanosService} from './sc-thanos.service';

@Directive({
  selector: '[scThanos]',
})
export class ScThanosDirective implements OnDestroy {

  private subscription: Subscription;

  constructor(private vaporizeDomElem: ElementRef<HTMLElement>, private thanosService: ScThanosService, private zone: NgZone) {
  }

  vaporize() {
    const elem = this.vaporizeDomElem.nativeElement;
    this.subscription = this.thanosService.vaporize(elem).subscribe({
      complete: () => this.zone.run(() => elem.parentElement.removeChild(elem))
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
