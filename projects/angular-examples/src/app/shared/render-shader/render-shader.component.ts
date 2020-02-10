import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy, Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as Stats from 'stats.js';
import {Camera, Mesh, OrthographicCamera, PlaneBufferGeometry, Renderer, Scene, ShaderMaterial, Vector2, WebGLRenderer} from 'three';
import {defaultVertexShader} from './default-vertex-shader';

@Component({
  selector: 'app-render-shader',
  templateUrl: './render-shader.component.html',
  styleUrls: ['./render-shader.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenderShaderComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() shaderCode: string;
  @Input() vertexShader: string;
  @Input() runAnimation = true;
  @Input() showFps = false;
  @Input() canvasWidth: number;
  @Input() canvasHeight: number;
  @Output() error: EventEmitter<any> = new EventEmitter<any>();

  private renderer: Renderer;

  private camera: Camera;
  private geometry: PlaneBufferGeometry;
  private material: ShaderMaterial;
  private mesh: Mesh;

  private scene: Scene;
  private uniforms: any;
  private stats: Stats;
  @ViewChild('canvasContainer', {static: true}) private canvasContainer: ElementRef<HTMLDivElement>;
  @ViewChild('webGLCanvas', {static: true}) private webGLCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('stats', {static: true}) private statsElem: ElementRef;

  constructor(@Inject(NgZone) private _ngZone: NgZone) {
  }

  ngAfterViewInit() {
    const renderParams = {
      antialias: true,
      canvas: this.webGLCanvas.nativeElement,
    };
    this.renderer = new WebGLRenderer(renderParams);

    this.uniforms = {
      time: {value: 1.0},
      resolution: {value: new Vector2(this.canvasWidth, this.canvasHeight)},
      mouse: {value: new Vector2(0.5, 0.5)}
    };

    this.onResize();

    this.scene = new Scene();
    this.stats = new Stats();
    this.statsElem.nativeElement.appendChild(this.stats.dom);

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.geometry = new PlaneBufferGeometry(2, 2);

    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vertexShader || defaultVertexShader,
      fragmentShader: this.shaderCode
    });

    this.mesh = new Mesh(this.geometry, this.material);

    this.webGLCanvas.nativeElement.onmousemove = (e) => this.onMouseMove(e);
    this.webGLCanvas.nativeElement.ontouchmove = (e) => this.onTouchMove(e);
    this.scene.add(this.mesh);
    this.animate(1.0);
  }

  ngOnDestroy(): void {
    if (this.renderer instanceof WebGLRenderer) {
      console.log('ngOnDestroy: WebGLRenderer dispose.');
      this.renderer.forceContextLoss();
      this.renderer.dispose();
    }
  }

  onMouseMove(e: MouseEvent) {
    this.uniforms.mouse.value.x = e.offsetX / this.canvasWidth;
    this.uniforms.mouse.value.y = (this.canvasHeight - e.offsetY) / this.canvasHeight;
  }

  onTouchMove(e: TouchEvent) {
    const touch = e.touches[0];
    const x = touch.pageX - this.getOffsetLeft(e.target);
    const y = touch.pageY - this.getOffsetTop(e.target);
    this.uniforms.mouse.value.x = Math.max(Math.min(x / this.canvasWidth, 1.0), 0.0);
    this.uniforms.mouse.value.y = Math.max(Math.min((this.canvasHeight - y) / this.canvasHeight, 1.0), 0.0);
  }

  private getOffsetLeft(elem) {
    let offsetLeft = 0;
    do {
      if (!isNaN(elem.offsetLeft)) {
        offsetLeft += elem.offsetLeft;
      }
    } while (elem = elem.offsetParent);
    return offsetLeft;
  }

  private getOffsetTop(elem) {
    let offsetTop = 0;
    do {
      if (!isNaN(elem.offsetTop)) {
        offsetTop += elem.offsetTop;
      }
    } while (elem = elem.offsetParent);
    return offsetTop;
  }

  onResize() {
    if (this.canvasWidth && this.canvasHeight) {
      this.renderer.setSize(this.canvasWidth, this.canvasHeight);
      this.uniforms.resolution.value = new Vector2(this.canvasWidth, this.canvasHeight);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.runAnimation && !changes.runAnimation.isFirstChange() && changes.runAnimation.currentValue) {
      requestAnimationFrame(timestamp => this.animate(timestamp));
    }
    if (changes.shaderCode && !changes.shaderCode.isFirstChange()) {
      this.material.setValues({fragmentShader: this.shaderCode});
      this.material.needsUpdate = true;
    }

    if (changes.canvasWidth && !changes.canvasWidth.isFirstChange()) {
      this.onResize();
    }

    if (changes.canvasHeight && !changes.canvasHeight.isFirstChange()) {
      this.onResize();
    }
  }

  render(time: number) {
    this.stats.begin();
    this.uniforms.time.value = time / 1000;
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
  }

  animate(time: number) {
    try {
      this._ngZone.runOutsideAngular(() => {
        if (this.runAnimation) {
          requestAnimationFrame(timestamp => this.animate(timestamp));
        }
        this.render(time);
      });
    } catch (e) {
      this.error.next(e);
    }
  }

}
