import {CommonModule} from '@angular/common';
import {Component, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import image from '../assets/how-to-be-funny.png';
import {ScThanosDirective} from './sc-thanos.directive';
import {ScThanosModule} from './sc-thanos.module';
import {ScThanosService} from './sc-thanos.service';

describe('ScThanosDirective', () => {
  @Component({
    template: `
      <div class="thanos-test-container"
       scThanos
       (scThanosComplete)="completed();"><h1>My content for the div</h1>
        <img alt="funny-face" style="height: 400px" src="${image}">
      </div>
      <div>
        <div class="div-without-remove"
        scThanos
        #myThanos="thanos">
          This div should be disappear when clicked on button!
        </div>
        <button (click)="myThanos.vaporize(false)">Vaporize div above</button>
      </div>
    `,
    styles: [`
      .div-without-remove {
        border: 1px solid aqua;
        height: 300px;
        background: linear-gradient(to right, #cbe7e1 0%, #a7d7cc 17%, #84c8b8 33%, #00f6bd 52%, #00d2a1 83%, #00ae85 92%);
      }
      .thanos-test-container {
        padding: 14px;
      }`]
  })
  class HostComponent {
    private scThanosDirective: ScThanosDirective;
    showComplete = false;

    @ViewChild(ScThanosDirective)
    set thanos(thanos: ScThanosDirective) {
      this.scThanosDirective = thanos;
    }

    startThanos() {
      this.showComplete = false;
      this.scThanosDirective.vaporize();
    }

    completed() {
      console.log('Completed');
    }
  }

  let directive: ScThanosDirective;
  let hostFixture: ComponentFixture<HostComponent>;
  let hostComp: HostComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ScThanosModule.forRoot({animationLength: 20000}), CommonModule],
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
