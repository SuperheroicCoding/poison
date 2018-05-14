import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, zip} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import {ReactionDiffKernelModules} from './reaction-diff-window';
import {tap} from 'rxjs/internal/operators';

@Injectable()
export class LoadGpuKernelsResolver implements Resolve<ReactionDiffKernelModules> {
  private calcNextKernel$: Observable<string>;
  private imageKernelModule$: Observable<string>;
  private kernels: ReactionDiffKernelModules;

  constructor(private httpClient: HttpClient) {
    this.calcNextKernel$ = httpClient.get('./assets/reaction-diff/calc-next-kernel.js', {responseType: 'text'});
    this.imageKernelModule$ = httpClient.get('./assets/reaction-diff/image-kernel.js', {responseType: 'text'});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ReactionDiffKernelModules> {
    if (this.kernels) {
      return of(this.kernels);
    }
    return zip(this.calcNextKernel$, this.imageKernelModule$).pipe(
      map(([calcNext, image]) => {
        return ({
          calcNextKernelModule: eval(calcNext),
          imageKernelModule: eval(image)
        });
      }),
      tap(kernels => this.kernels = kernels)
    );
  }

}
