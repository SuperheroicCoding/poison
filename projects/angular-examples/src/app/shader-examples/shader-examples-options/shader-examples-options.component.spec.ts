import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';

import {ShaderExamplesOptionsComponent} from './shader-examples-options.component';

describe('ShaderExamplesOptionsComponent', () => {
  let component: ShaderExamplesOptionsComponent;
  let fixture: ComponentFixture<ShaderExamplesOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, CoreModule.forRoot(), RouterTestingModule],
      declarations: [ShaderExamplesOptionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShaderExamplesOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
