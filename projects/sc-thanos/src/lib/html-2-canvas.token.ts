import {InjectionToken} from '@angular/core';
import * as _html2canvas from 'html2canvas';

export const HTML2CANVAS_INJECTION_TOKEN = new InjectionToken<Html2CanvasStatic>(
  'html2canvas', {
    providedIn: 'root',
    factory: () => _html2canvas
  });
