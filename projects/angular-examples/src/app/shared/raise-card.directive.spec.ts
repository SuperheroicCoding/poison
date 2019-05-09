import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

import {RaiseCardDirective} from './raise-card.directive';

@Component({
  template: `
    <div appRaiseCard class="classThatShouldNotBeDeleted" [raiseLevel]="15"></div>
  `
})
class TestRaiseCardComponent {
}

describe('RaiseCard directive', () => {
  let directive: TestRaiseCardComponent;
  let fixture: ComponentFixture<TestRaiseCardComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RaiseCardDirective, TestRaiseCardComponent], // declare the test component
    });

    fixture = TestBed.createComponent(TestRaiseCardComponent);

    directive = fixture.componentInstance; // TestRaiseCardComponent test instance

    // query for the title <h1> by CSS element selector
    de = fixture.debugElement.query(By.css('div'));
    el = de.nativeElement;

    // init bindings
    fixture.detectChanges();
  });

  afterEach(() => {
    thenOtherClassesShouldNotBeDeleted();
  });

  it('should not have the mat-elevation class initialy', () => {
    thenElevationClassShouldNotBeSet();
  });

  it('should add elevation class on mouseenter', () => {
    de.triggerEventHandler('mouseenter', undefined);
    fixture.detectChanges();
    thenElevationClassShouldBeSet();
  });

  it('should remove elevation class on mouseleave', () => {
    de.triggerEventHandler('mouseenter', undefined);
    fixture.detectChanges();
    thenElevationClassShouldBeSet();
    de.triggerEventHandler('mouseleave', undefined);
    fixture.detectChanges();
    thenElevationClassShouldNotBeSet();
  });

  function thenElevationClassShouldNotBeSet() {
    expect(el.classList.contains('mat-elevation-z15')).toBeFalsy();
  }

  function thenElevationClassShouldBeSet() {
    expect(el.classList.contains('mat-elevation-z15')).toBeTruthy();
  }

  function thenOtherClassesShouldNotBeDeleted() {
    expect(el.classList.contains('classThatShouldNotBeDeleted')).toBeTruthy();
  }
});
