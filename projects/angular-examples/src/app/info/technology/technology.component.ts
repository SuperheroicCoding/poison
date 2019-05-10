import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ScThanosDirective} from 'sc-thanos';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.less']
})
export class TechnologyComponent implements OnInit {

  @Input() title;
  @Input() link;
  @Input() image;

  @ViewChild(ScThanosDirective, { static: true })
  private thanos: ScThanosDirective;

  constructor() {
  }

  ngOnInit() {
  }

  openTechnology() {
    this.thanos.vaporize();
    // window.open(this.link, '_blank');
  }


}
