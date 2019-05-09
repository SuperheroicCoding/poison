import {Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appRaiseCard]'
})
export class RaiseCardDirective implements OnChanges {

  static elevationClass = 'mat-elevation-z';

  @Input() raiseLevel: number;

  private defaultRaiseLevel = 10;

  constructor(private el: ElementRef) {
  }

  getRaiseClass() {
    return RaiseCardDirective.elevationClass + (this.raiseLevel || this.defaultRaiseLevel);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.raiseLevel != null) {
      if (changes.raiseLevel.isFirstChange()) {
        this.el.nativeElement.classList.remove(RaiseCardDirective.elevationClass + this.defaultRaiseLevel);
      } else {
        this.el.nativeElement.classList.remove(RaiseCardDirective.elevationClass + changes.raiseLevel.previousValue);
      }
    }
  }

  @HostListener('mouseenter')
  addRaisedClass() {
    this.el.nativeElement.classList.add(this.getRaiseClass());
  }

  @HostListener('mouseleave')
  unraise() {
    this.el.nativeElement.classList.remove(this.getRaiseClass());
  }
}
