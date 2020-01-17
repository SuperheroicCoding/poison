import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.less']
})
export class TechnologyComponent implements OnInit {

  @Input() title;
  @Input() link;
  @Input() image;

  constructor() {
  }

  ngOnInit() {
  }

}
