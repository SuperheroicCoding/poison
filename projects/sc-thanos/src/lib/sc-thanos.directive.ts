import {AfterViewInit, Directive, ElementRef, NgZone} from '@angular/core';
import {ScThanosService} from './sc-thanos.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[scThanos]',
})
export class ScThanosDirective implements AfterViewInit {

  constructor(private vaporizeDomElem: ElementRef<HTMLElement>, private thanosService: ScThanosService, private zone: NgZone) {
  }

  vaporize() {
    this.zone.runOutsideAngular(() =>this.thanosService.vaporize(this.vaporizeDomElem.nativeElement).subscribe(
    ));
  }

  ngAfterViewInit(): void {
  }

}
