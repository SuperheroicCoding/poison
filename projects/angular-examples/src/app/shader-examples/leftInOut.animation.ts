import {style} from '@angular/animations';

export const fadeInRight = [
  style({transform: 'translate3d(4000px, 0, 0)', opacity: 0, offset: 0}),
  style({transform: 'translate3d(0, 0, 0)', opacity: 1, offset: 1}),
];

export const fadeInLeft = [
  style({transform: 'translate3d(-4000px, 0, 0)', opacity: 0, offset: 0}),
  style({transform: 'translate3d(0, 0, 0)', opacity: 1, offset: 1}),
];

export const fadeOutRight = [
  style({transform: 'translate3d(0, 0, 0)', opacity: 1, offset: 0}),
  style({transform: 'translate3d(2000px, 0, 0)', opacity: 0, offset: 1}),
];
export const fadeOutLeft = [
  style({transform: 'translate3d(0, 0, 0)', opacity: 1, offset: 0}),
  style({transform: 'translate3d(-2000px, 0, 0)', opacity: 0, offset: 1}),
];
