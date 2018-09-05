import {Injectable} from '@angular/core';
import {ShaderExampleState, ShaderExamplesUIStore} from './shader-examples.store';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {transaction as Transaction} from '@datorama/akita';
import {PageEvent} from '@angular/material';
import {ShaderCodeQuery} from './shader-code.query';
import {ShaderCodeService} from './shader-code.service';
import {ShaderCode} from './shader-code.model';
import {ShaderExamplesUIQuery} from './shader-examples.query';
import {catchError, filter, take, timeout} from 'rxjs/operators';
import {EMPTY, throwError, TimeoutError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShaderExamplesService {

  constructor(private shaderExamplesUIStore: ShaderExamplesUIStore,
              private breakpointObserver: BreakpointObserver,
              private shaderCodeQuery: ShaderCodeQuery,
              private shaderExamplesQuery: ShaderExamplesUIQuery,
              private shaderCodeService: ShaderCodeService) {
    shaderCodeService.get();
    this.breakpointObserver.observe(
      [Breakpoints.HandsetLandscape,
        Breakpoints.HandsetPortrait]).subscribe(
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
    const snapshot = this.shaderExamplesQuery.getSnapshot();
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
      {currentPage: Object.assign({}, state.currentPage, newPageEvent)}
    );
  }
}
