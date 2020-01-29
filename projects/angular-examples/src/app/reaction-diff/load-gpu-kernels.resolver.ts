import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {iif, Observable, of, zip} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {map, take} from 'rxjs/operators';
import {ReactionDiffKernelModules} from './reaction-diff-window';
import {tap} from 'rxjs/internal/operators';

@Injectable()
export class LoadGpuKernelsResolver implements Resolve<ReactionDiffKernelModules> {
  private calcNextKernel$: Observable<string>;
  private imageKernelModule$: Observable<string>;
  private kernels: ReactionDiffKernelModules;

  constructor(private httpClient: HttpClient) {
    this.calcNextKernel$ = httpClient.get('./assets/reaction-diff/calc-next-grid-kernel.js', {responseType: 'text'});
    this.imageKernelModule$ = httpClient.get('./assets/reaction-diff/image-kernel.js', {responseType: 'text'});
  }

  /* tslint:disable:no-eval */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ReactionDiffKernelModules> {

    return iif(() => this.kernels != null,
      of(this.kernels),
      zip(this.calcNextKernel$, this.imageKernelModule$).pipe(
      map(([calcNext, image]) => {
        return ({
          calcNextKernelModule: eval(calcNext),
          imageKernelModule: eval(image)
        });
      }),
      take(1),
      tap(kernels => this.kernels = kernels)
      )
    );
  }

}
