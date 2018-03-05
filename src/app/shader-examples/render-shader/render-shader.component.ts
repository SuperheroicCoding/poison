import {Component, DoCheck, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Camera, Mesh, OrthographicCamera, PlaneBufferGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer} from 'three';
import {defaultVertexShader} from '../vertex-shader';
import * as Stats from 'stats.js';

@Component({
  selector: 'app-render-shader',
  templateUrl: './render-shader.component.html',
  styleUrls: ['./render-shader.component.less']
})
export class RenderShaderComponent implements OnInit, OnChanges, DoCheck {

  @Input() shaderCode: string;
  @Input() vertexShader?: string;
  @Input() runAnimation = true;
  @Input() showFps = true;

  @ViewChild('webGlCanvas') shaderCanvas: ElementRef;
  @ViewChild('canvasContainer') canvasContainer: ElementRef;
  @ViewChild('stats') statsElem: ElementRef;

  private renderer: WebGLRenderer;

  private camera: Camera;
  private geometry: PlaneBufferGeometry;
  private material: ShaderMaterial;
  private mesh: Mesh;

  private scene: Scene;
  private uniforms: any;
  private stats: Stats;
  private width: number;
  private height: number;

  constructor() {
  }

  ngOnInit() {
    this.renderer = new WebGLRenderer({
      antialias: true,
      canvas: this.shaderCanvas.nativeElement,
    });

    this.width = this.canvasWidth();
    this.height = this.canvasHeight();

    this.uniforms = {
      time: {value: 1.0},
      resolution: {value: new Vector2(this.width, this.height)},
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

    this.shaderCanvas.nativeElement.onmousemove = (e) => this.onMouseMove(e);
    this.scene.add(this.mesh);
    this.animate(1.0);
  }

  onMouseMove(e: MouseEvent) {
    console.log(this.width, e.offsetX);
    this.uniforms.mouse.value.x = e.offsetX / this.width;
    this.uniforms.mouse.value.y = (this.height - e.offsetY) / this.height;
  }

  onResize() {
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(this.width / this.height);
    this.uniforms.resolution.value = new Vector2(this.width, this.height);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.runAnimation && !changes.runAnimation.isFirstChange() && changes.runAnimation.currentValue) {
      requestAnimationFrame(timestamp => this.animate(timestamp));
      return;
    }
  }

  ngDoCheck() {
    if (this.width !== this.canvasWidth() || this.height !== this.canvasHeight()) {
      this.width = this.canvasWidth();
      this.height = this.canvasHeight();
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
    if (this.runAnimation) {
      requestAnimationFrame(timestamp => this.animate(timestamp));
    }
    this.render(time);
  }

  private canvasWidth() {
    return 300;
  }

  private canvasHeight() {
    return 200;
  }

}
