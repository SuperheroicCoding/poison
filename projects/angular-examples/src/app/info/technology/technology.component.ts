import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.less']
})
export class TechnologyComponent implements OnInit {

  @Input() title: string;
  @Input() link: string ;
  @Input() image: string;

  constructor() {
  }

  ngOnInit() {
  }

}
