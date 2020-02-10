import {ElementRef} from '@angular/core';

export class ResizedEvent {

  readonly element: HTMLElement;
  readonly newWidth: number;
  readonly newHeight: number;
  constructor(
    entry: ResizeObserverEntry,
    private readonly oldWidth: number,
    private readonly oldHeight: number
  ) {
    this.element = entry.target as HTMLElement;
    ({width: this.newWidth, height: this.newHeight} = entry.contentRect);
  }
}
