import {Component, OnInit} from '@angular/core';
import {ShaderExamplesService, ShaderExamplesUIQuery} from '../state';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-shader-examples-options',
  templateUrl: './shader-examples-options.component.html',
  styleUrls: ['./shader-examples-options.component.scss']
})
export class ShaderExamplesOptionsComponent implements OnInit {
  isLoading: Observable<boolean>;
  showFps: Observable<boolean>;
  showCodeEditor: Observable<boolean>;

  constructor(private shaderExamplesQuery: ShaderExamplesUIQuery, private shaderExamplesService: ShaderExamplesService) {
  }

  ngOnInit() {
    this.isLoading = this.shaderExamplesQuery.selectLoading();
    this.showFps = this.shaderExamplesQuery.showFps;
    this.showCodeEditor = this.shaderExamplesQuery.showCodeEditor;
  }

  toggleShowFPS() {
    this.shaderExamplesService.toggleShowFps();
  }

  toggleShowCodeEditor() {
    this.shaderExamplesService.toggleShowEditor();
  }
}
