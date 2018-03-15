import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ShaderDef, shaders} from './shaders';
import {PageEvent} from '@angular/material';
import {Subject} from 'rxjs/Subject';
import {debounceTime, map} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';

interface ShaderModel extends ShaderDef {
  fullSize: boolean;
}

@Component({
  selector: 'app-shader-examples',
  templateUrl: './shader-examples.component.html',
  styleUrls: ['./shader-examples.component.less']
})
export class ShaderExamplesComponent implements OnInit {
  shaders: ShaderModel[];
  showFps: boolean;
  shadersPaged$: Observable<ShaderModel[]>;
  currentPageSubject: Subject<PageEvent> = new ReplaySubject(1);
  defaultPageSize = 2;
  @ViewChild('shaderRenderer') shaderRenderer: ElementRef;

  constructor() {
    this.shaders = shaders.map((shader: ShaderDef) => Object.assign({fullSize: false}, shader));
    this.showFps = false;
    this.shadersPaged$ = this.currentPageSubject.asObservable()
      .pipe(
        debounceTime<PageEvent>(400),
        map((event => this.shaders.slice(event.pageSize * event.pageIndex, event.pageSize * event.pageIndex + event.pageSize))),
      );
  }

  ngOnInit() {
    const currentPage = {length: this.shaders.length, pageIndex: 0, pageSize: this.defaultPageSize};
    this.changeCurrentShaderPage(currentPage);
  }

  changeCurrentShaderPage($event: PageEvent) {
    this.currentPageSubject.next($event);
  }

  rendererHeight() {
    if (this.shaderRenderer && this.shaderRenderer.nativeElement) {
      return this.shaderRenderer.nativeElement.clientHeight;
    }
    return 600;
  }

  rendererWidth() {
    if (this.shaderRenderer && this.shaderRenderer.nativeElement) {
      return this.shaderRenderer.nativeElement.clientWidth;
    }
    return 800;
  }

}
