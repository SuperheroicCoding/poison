import {AppRoute} from './app-routing.module';
import {InjectionToken} from '@angular/core';

export const ROUTER_LINKS = new InjectionToken<AppRoute[]>('routerLinks');
