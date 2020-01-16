import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CoreModule} from '../core/core.module';
import {LoginModule} from '../login/login.module';
import {ServiceWorkerUpdateComponent} from '../service-worker-update/service-worker-update.component';
import {SharedModule} from '../shared/shared.module';
import {MainToolbarComponent} from './main-toolbar.component';

describe('MainToolbarComponent', () => {
  let component: MainToolbarComponent;
  let fixture: ComponentFixture<MainToolbarComponent>;

  beforeEach(async(() =>
    TestBed.configureTestingModule({
      imports: [SharedModule, LoginModule, CoreModule, RouterTestingModule],
      declarations: [MainToolbarComponent, ServiceWorkerUpdateComponent]
    })
      .compileComponents()
  ));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
