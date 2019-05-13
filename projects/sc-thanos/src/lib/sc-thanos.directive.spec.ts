import {Component, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ScThanosDirective} from './sc-thanos.directive';
import {ScThanosModule} from './sc-thanos.module';
import {ScThanosService} from './sc-thanos.service';
import image from '../assets/how-to-be-funny.png';

describe('ScThanosDirective', () => {
  @Component({
    template: `
      <div class="thanos-test-container" scThanos><h1>My content for the div</h1>
        <img alt="funny-face" style="height: 400px" src="${image}">
      </div>
      <div>Test without Thanos</div>
    `,
    styles: [`
      .thanos-test-container {
        padding: 14px;
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
      imports: [ScThanosModule.forRoot()],
      declarations: [HostComponent]
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

    fit('should call thanosService.vaporize', () => {
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
