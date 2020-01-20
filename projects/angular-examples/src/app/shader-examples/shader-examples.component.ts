import {AfterContentInit, ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {BehaviorSubject, Observable} from 'rxjs';
import {animate, keyframes, transition, trigger} from '@angular/animations';
import {fadeInLeft, fadeInRight, fadeOutLeft, fadeOutRight} from './leftInOut.animation';
import {ShaderCode, ShaderCodeQuery, ShaderExamplesService, ShaderExamplesUIQuery} from './state';

@Component({
  selector: 'app-shader-examples',
  templateUrl: './shader-examples.component.html',
  styleUrls: ['./shader-examples.component.scss'],
  animations: [
    trigger('animator', [
      transition('void => *', animate(1000, keyframes(fadeInRight))),
      transition('* => fadeOutLeft', animate(200, keyframes(fadeOutLeft))),
      transition('* => fadeOutRight', animate(200, keyframes(fadeOutRight))),
      transition('fadeOutRight => *', animate(400, keyframes(fadeInLeft))),
      transition('fadeOutLeft => *', animate(400, keyframes(fadeInRight))),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShaderExamplesComponent implements AfterContentInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoadingShaders: Observable<boolean>;
  isLoading: Observable<boolean>;
  private animationEnded$: BehaviorSubject<boolean>;

  constructor(public state: ShaderExamplesUIQuery,
              shaderCodeQuery: ShaderCodeQuery,
              private shaderExamplesService: ShaderExamplesService) {
    this.isLoading = this.state.selectLoading();
    this.isLoadingShaders = shaderCodeQuery.selectLoading();
  }

  ngAfterContentInit() {
    this.animationEnded$ = new BehaviorSubject<boolean>(true);
  }

  changeCurrentShaderPage($event: PageEvent) {
    this.shaderExamplesService.updateCurrentPage($event);
  }

  trackByIndex(index, elem) {
    return index;
  }

  previousPage() {
    this.startAnimation('fadeOutRight');
    if (this.paginator.hasPreviousPage()) {
      this.paginator.previousPage();
    } else {
      this.paginator.lastPage();
    }
  }

  nextPage() {
    this.startAnimation('fadeOutLeft');
    if (this.paginator.hasNextPage()) {
      this.paginator.nextPage();
    } else {
      this.paginator.firstPage();
    }
  }

  startAnimation(state) {
    this.shaderExamplesService.updateAnimationState(state);
  }

  resetAnimationState() {
    this.shaderExamplesService.updateAnimationState('');
  }

  updateShaderCode(shader: ShaderCode, code: string) {
    this.shaderExamplesService.updateShaderCode(shader, code);
  }
}
