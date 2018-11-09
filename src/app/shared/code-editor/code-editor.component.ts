import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.less']
})
export class CodeEditorComponent implements OnInit {

  private codeValue: string;

  @Input() mode: string;

  @Input() get code(): string {
    return this.codeValue;
  }
  @Input() codeTitle?: string;

  @Output() codeChange: EventEmitter<string> = new EventEmitter<string>();

  options: any = {maxLines: 1000, printMargin: false};


  set code(code) {
    this.codeValue = code;
    this.codeChange.emit(this.codeValue);
  }

  constructor() {
  }

  ngOnInit() {
  }

}
