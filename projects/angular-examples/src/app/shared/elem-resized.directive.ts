import {Directive, ElementRef, EventEmitter, OnDestroy, Output} from '@angular/core';
import {default as ResizeObserver} from 'resize-observer-polyfill';
import {ResizedEvent} from './resized-event';

@Directive({
  selector: '[appElemResized]'
})
export class ElemResizedDirective implements OnDestroy {

  @Output()
  readonly appElemResized = new EventEmitter<ResizedEvent>();

  private oldWidth: number;
  private oldHeight: number;
  private resizeObserver: ResizeObserver;

  constructor(private readonly element: ElementRef) {
    this.resizeObserver =
      new ResizeObserver((resizeEntry: ResizeObserverEntry[], observer: ResizeObserver) => {
        const {contentRect} = resizeEntry[0];
        const {width, height} = contentRect;
        if (width === this.oldWidth && height === this.oldHeight) {
          return;
        }

        this.appElemResized.emit(new ResizedEvent(resizeEntry[0], this.oldWidth, this.oldHeight));
        this.oldWidth = width;
        this.oldHeight = height;
      });
    this.resizeObserver.observe(this.element.nativeElement);
  }


  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

}
