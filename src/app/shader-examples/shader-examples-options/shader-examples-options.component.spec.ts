import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShaderExamplesOptionsComponent } from './shader-examples-options.component';

describe('ShaderExamplesOptionsComponent', () => {
  let component: ShaderExamplesOptionsComponent;
  let fixture: ComponentFixture<ShaderExamplesOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShaderExamplesOptionsComponent ]
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
