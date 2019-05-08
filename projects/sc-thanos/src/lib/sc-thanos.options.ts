import {InjectionToken} from '@angular/core';

export interface ScThanosOptions {
  animationLength: number;
  maxParticleCount: number;
}

export const defaultScThanosConfig: ScThanosOptions = {
  animationLength: 5000,
  maxParticleCount: 400000
};

export const SC_THANOS_OPTIONS_TOKEN = new InjectionToken<ScThanosOptions>('thaosOptions', {
  providedIn: 'root',
  factory: () => defaultScThanosConfig
});
