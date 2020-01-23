import {CommonModule} from '@angular/common';
import {Component, QueryList, ViewChildren} from '@angular/core';
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
      <div class="grid-test">
        <sc-thanos class="div-without-remove"
          #myThanos="thanos">
            This div should be vaporized when clicked on button and then become visible again!
        <div class="inner">
            Inner container
        </div>
        </sc-thanos>
        <button (click)="myThanos.vaporize(false)">Vaporize div above</button>
      </div>
    `,
    styles: [`
      * {
        box-sizing: border-box;
      }

      .div-without-remove {
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        grid-template-columns: 1fr 1fr 1fr;
        place-content: center;
        padding: 50px;
        border: 10px solid darkorange;
        border-radius: 30px;
        height: 300px;
        background-image: linear-gradient(to right, #cbe7e1, #00ae85);
      }

      .inner {
        border-radius: 50%;
        grid-column: 2;
        grid-row: 1;
        background-image: linear-gradient(to right, azure, darkorchid);
        text-align: center;
        padding-top: 1rem;
      }

      .grid-test {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr auto;
      }

      .thanos-test-container {
        padding: 14px;
      }`]
  })
  class HostComponent {
    private scThanosDirective: ScThanosDirective;
    showComplete = false;

    @ViewChildren(ScThanosDirective)
    set thanos(thanos: QueryList<ScThanosDirective>) {
      this.scThanosDirective = thanos.first;
    }

    startThanos() {
      this.showComplete = false;
      return this.scThanosDirective.vaporize();
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
      imports: [ScThanosModule.forRoot({maxParticleCount: 20000, animationLength: 4000}), CommonModule],
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

    let completedResult: boolean;

    beforeEach(() => {
      thanosService = TestBed.inject(ScThanosService);
      completedResult = false;
      spyOn(thanosService, 'vaporize').and.callThrough();
    });

    it('should call thanosService.vaporize', () => {
      whenVaporizeIsCalled();
      thenThanosServiceVaporizeWasCalled();
    });

    it('should emit when vaporize is complete', async () => {
      await whenVaporizeIsCalled();
      thenThanosCompleteIsEmitted();
    });

    function thenThanosServiceVaporizeWasCalled() {
      expect(thanosService.vaporize).toHaveBeenCalled();
    }

    function whenVaporizeIsCalled(): Promise<void> {
      return new Promise<void>((then, error) =>
        hostComp.startThanos().subscribe({
          next: () => {
            completedResult = true;
            then();
          }, error
        }));
    }

    function thenThanosCompleteIsEmitted() {
      expect(completedResult).toBeTruthy();
    }
  });
});
