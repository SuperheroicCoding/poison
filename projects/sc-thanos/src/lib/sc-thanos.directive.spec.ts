import {Component, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ScThanosDirective} from './sc-thanos.directive';
import {ScThanosService} from './sc-thanos.service';

describe('ScThanosDirective', () => {
  @Component({
    template: `
      <div scThanos><h1>My content for the div</h1>
        <img alt="funny-face" style="height: 400px" src="../assets/how-to-be-funny.jpg">
      </div>
    `,
    styles: [`
      [scThanos] {
        background-color: lightblue;
      }`]
  })
  class HostComponent {
    private scThanosDirective: ScThanosDirective;

    @ViewChild(ScThanosDirective)
    set thanos(thanos: ScThanosDirective) {
      this.scThanosDirective = thanos;
    }

    startThanos() {
      this.scThanosDirective.vaporize();
    }
  }

  let directive: ScThanosDirective;
  let hostFixture: ComponentFixture<HostComponent>;
  let hostComp: HostComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScThanosDirective, HostComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    hostFixture = TestBed.createComponent(HostComponent);
    hostComp = hostFixture.componentInstance;
    hostFixture.detectChanges();
    directive = hostFixture.debugElement.query(By.directive(ScThanosDirective)).componentInstance;
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  describe('vaporize()', () => {
    let thanosService: ScThanosService;
    beforeEach(() => {
      thanosService = TestBed.get(ScThanosService);
      spyOn(thanosService, 'vaporize').and.callThrough();
    });

    fit('should call htmlToCanvas on content', () => {
      whenVaporizeIsCalled();
      thenThanosServiceVaporizeWasCalled();
    });

    function thenThanosServiceVaporizeWasCalled() {
      expect(thanosService.vaporize).toHaveBeenCalled();
    }

    function whenVaporizeIsCalled() {
      hostComp.startThanos();
    }
  });
});
