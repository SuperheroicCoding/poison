import {AfterContentInit, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {Camera, Mesh, OrthographicCamera, PlaneBufferGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer} from 'three';
import {defaultVertexShader} from '../vertex-shader';
import * as Stats from 'stats.js';

@Component({
  selector: 'app-render-shader',
  templateUrl: './render-shader.component.html',
  styleUrls: ['./render-shader.component.less']
})
export class RenderShaderComponent implements AfterContentInit, OnChanges {
  @Input() height: number;
  @Input() width: number;
  @Input() shaderCode: string;
  @Input() vertexShader?: string;
  @Input() runAnimation = true;
  @Input() showFps = true;

  @ViewChild('webGlCanvas') shaderCanvas: ElementRef;
  @ViewChild('stats') statsElem: ElementRef;

  private renderer: WebGLRenderer;

  private camera: Camera;
  private geometry: PlaneBufferGeometry;
  private material: ShaderMaterial;
  private mesh: Mesh;

  private scene: Scene;
  private uniforms: any;
  private stats: Stats;

  constructor() {
  }

  ngAfterContentInit() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.shaderCanvas.nativeElement
    });
    this.renderer.setPixelRatio(this.width / this.height);
    this.renderer.setSize(this.width, this.height);

    this.scene = new Scene();

    this.stats = new Stats();
    this.statsElem.nativeElement.appendChild(this.stats.dom);

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.geometry = new PlaneBufferGeometry(2, 2);

    this.uniforms = {
      time: {value: 1.0},
      resolution: {value: new Vector2(this.width, this.height)}
    };

    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vertexShader || defaultVertexShader,
      fragmentShader: this.shaderCode
    });

    this.mesh = new Mesh(this.geometry, this.material);


    this.scene.add(this.mesh);
    this.animate(1.0);
  }

  onResize() {
    this.renderer.setSize(this.width, this.height);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.runAnimation && changes.runAnimation.currentValue) {
      requestAnimationFrame(timestamp => this.animate(timestamp));
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

}
