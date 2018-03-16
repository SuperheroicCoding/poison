import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ShaderDef, shaders} from './shaders';
import {PageEvent} from '@angular/material';
import {Subject} from 'rxjs/Subject';
import {debounceTime, distinctUntilChanged, map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {DomSanitizer} from '@angular/platform-browser';

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
  showCodeEditor: boolean;
  shadersPaged$: Observable<ShaderModel[]>;
  currentPage$: Observable<PageEvent>;
  currentPageSubject: Subject<PageEvent> = new ReplaySubject(1);
  pageSize = 2;
  @ViewChild('shaderRenderer') shaderRenderer: ElementRef;

  get gridTemplateColumns() {
    return this.sanitizer.bypassSecurityTrustStyle(`repeat(${this.pageSize}, 1fr)`)
  };

  constructor(private sanitizer: DomSanitizer) {
    this.shaders = shaders.map((shader: ShaderDef) => Object.assign({fullSize: false}, shader));
    this.showFps = false;
    this.showCodeEditor = false;
    this.currentPage$ = this.currentPageSubject.asObservable().pipe(
      distinctUntilChanged((p1, p2) => p1.pageIndex === p2.pageIndex && p1.pageSize === p2.pageSize),
      tap(pageEvent => this.pageSize = pageEvent.pageSize),
      debounceTime<PageEvent>(400),
    );
    this.shadersPaged$ = this.currentPage$
      .pipe(
        debounceTime<PageEvent>(400),
        map((event => this.shaders.slice(event.pageSize * event.pageIndex, event.pageSize * event.pageIndex + event.pageSize)))
      );
  }

  ngOnInit() {
    const currentPage = {length: this.shaders.length, pageIndex: 0, pageSize: this.pageSize};
    this.changeCurrentShaderPage(currentPage);
  }

  changeCurrentShaderPage($event: PageEvent) {
    this.currentPageSubject.next($event);
  }

  get rendererHeight() {
    if (this.shaderRenderer && this.shaderRenderer.nativeElement) {
      return this.shaderRenderer.nativeElement.clientHeight;
    }
    return 1;
  }

  get rendererWidth() {
    if (this.shaderRenderer && this.shaderRenderer.nativeElement) {
      return this.shaderRenderer.nativeElement.clientWidth;
    }
    return 1;
  }

  trackByIndex(index, elem) {
    return index;
  }

}
