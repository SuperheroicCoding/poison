import {Injectable} from '@angular/core';
import {ShaderExampleState, ShaderExamplesUIStore} from './shader-examples.store';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {transaction as Transaction} from '@datorama/akita';
import { PageEvent } from '@angular/material/paginator';
import {ShaderCodeQuery} from './shader-code.query';
import {ShaderCodeService} from './shader-code.service';
import {ShaderCode} from './shader-code.model';
import {ShaderExamplesUIQuery} from './shader-examples.query';
import {catchError, debounceTime, distinctUntilChanged, filter, switchMap, take, tap, timeout} from 'rxjs/operators';
import {EMPTY, Subject, throwError, TimeoutError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShaderExamplesService {
  private updateShaderSubject: Subject<{ shader: ShaderCode, code: string }>;

  constructor(private shaderExamplesUIStore: ShaderExamplesUIStore,
              private breakpointObserver: BreakpointObserver,
              private shaderCodeQuery: ShaderCodeQuery,
              private shaderExamplesQuery: ShaderExamplesUIQuery,
              private shaderCodeService: ShaderCodeService) {
    shaderCodeService.get();
    this.updateShaderSubject = new Subject();
    this.updateShaderSubject
      .pipe(
        debounceTime(2000),
        distinctUntilChanged((x1, x2) =>
          x1.shader.id === x2.shader.id && x1.code === x2.code
        ),
        tap(() => this.shaderExamplesUIStore.update({savingShader: true})),
        switchMap(({shader, code}) => this.shaderCodeService.update(shader, code)),
        tap(() => this.shaderExamplesUIStore.update({savingShader: false}))
      ).subscribe();

    this.breakpointObserver.observe(
      [Breakpoints.HandsetLandscape,
        Breakpoints.HandsetPortrait])
      .subscribe(
        result => {
          this.updateScreenSize(result.matches);
        }
      );

    this.shaderCodeQuery.selectAll().subscribe(shaderCodes => {
      this.updateCurrentPage({length: shaderCodes.length || 0});
    });
  }

  toggleShowFps() {
    this.shaderExamplesUIStore.update(state => ({
      showFps: !state.showFps
    }));
  }

  @Transaction()
  toggleShowEditor() {
    const snapshot = this.shaderExamplesQuery.getValue();
    if (!snapshot.showCodeEditor) {
      this.updateShadersPerPage(1);
    }
    this.shaderExamplesUIStore.update(state => {
      return {showCodeEditor: !state.showCodeEditor};
    });
  }

  private updateShadersPerPage(pageSize: number) {
    this.updateCurrentPage({pageSize});
  }

  @Transaction()
  updateScreenSize(isSmall: boolean) {
    if (isSmall) {
      this.updateShadersPerPage(1);
    }
    this.shaderExamplesUIStore.update({
      isSmallScreen: isSmall
    });
  }

  @Transaction()
  updateCurrentPage(currentPage: Partial<PageEvent>) {
    this.shaderExamplesUIStore.update(this.updatePageEventFn(currentPage));
    this.updatePagedShaders();
  }

  updateAnimationState(animationState: '' | 'fadeOutRight' | 'fadeOutLeft') {
    this.shaderExamplesUIStore.update({animationState});
  }

  updateShaderCode(shader: ShaderCode, code: string) {
    this.updateShaderSubject.next({shader, code});
  }

  private updatePagedShaders(shaderCodes: ShaderCode[] = this.shaderCodeQuery.getAll()) {
    this.shaderExamplesQuery.animationState.pipe(
      filter(animationState => animationState === ''),
      take(1),
      timeout(500),
      catchError(error => (error instanceof TimeoutError) ? EMPTY : throwError(error)))
      .subscribe({
        complete: () => {
          this.shaderExamplesUIStore.update(state => {
            const event = state.currentPage;
            const startIndex = event.pageSize * event.pageIndex;
            return {
              pagedShaders:
                shaderCodes.slice(startIndex, startIndex + event.pageSize)
            };
          });
        }
      });
  }


  private updatePageEventFn(newPageEvent: Partial<PageEvent>) {
    return (state: ShaderExampleState) => (
      {currentPage: {...state.currentPage, ...newPageEvent}}
    );
  }


}
