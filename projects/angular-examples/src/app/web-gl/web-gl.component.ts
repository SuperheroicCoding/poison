import {AfterViewInit, Component, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {merge, Observable} from 'rxjs';

import {
  AmbientLight,
  BasicShadowMap,
  BoxGeometry,
  Clock,
  Color,
  FogExp2,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SpotLight,
  UniformsLib,
  UniformsUtils,
  WebGLRenderer
} from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import {MandelbrotFragment, MandelbrotVertex} from './mandelbrot-shader';
import {map} from 'rxjs/operators';

const TAU = Math.PI / 2;

@Component({
  selector: 'app-web-gl',
  templateUrl: './web-gl.component.html',
  styleUrls: ['./web-gl.component.less']
})
export class WebGlComponent implements OnInit, AfterViewInit, OnDestroy {


  @ViewChild('webGlCanvas', { static: true }) webGlCanvas: ElementRef;

  mouseup$ = new EventEmitter<MouseEvent>();
  mousedown$ = new EventEmitter<MouseEvent>();


  private renderer: WebGLRenderer;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private cube: Mesh;
  private lastFrameTime: number;
  private plane: Mesh;
  private width: number;
  private height: number;
  private pointLight: PointLight;
  private pointLightSphere: Mesh;
  private clock: Clock;
  private controls: any;

  private activateLook$: Observable<boolean>;

  constructor(private zone: NgZone) {
  }

  ngOnInit(): void {
    this.activateLook$ =
      merge(
        this.mousedown$.pipe(
          map((event) => {
            event.stopPropagation();
            event.preventDefault();
            return true;
          })),
        this.mouseup$.pipe(map((event) => {
          event.stopPropagation();
          event.preventDefault();
          return false;
        })));
  }

  ngOnDestroy(): void {
    this.renderer.dispose();
  }

  ngAfterViewInit(): void {
    this.clock = new Clock();
    this.scene = new Scene();
    this.scene.fog = new FogExp2(0xcccccc, 0.002);
    const canvas: HTMLCanvasElement = this.webGlCanvas.nativeElement;
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;
    this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.camera.rotation.x = -Math.PI / 5;
    this.camera.position.z = -0.6;
    this.camera.position.y = 1.86;
    this.camera.position.x = 10;
    this.renderer = new WebGLRenderer({canvas, antialias: true});
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = BasicShadowMap;
    this.renderer.setSize(this.width, this.height);

    this.controls = new OrbitControls(this.camera, canvas);

    const light = new AmbientLight(0xffffff);
    this.scene.add(light);

    const spotLight = new SpotLight(0xaaaaaa, 0.75, 200, 0.79, 2);
    spotLight.position.x = 3;
    spotLight.position.y = 2;
    this.scene.add(spotLight);
    const pointLight = this.createLight(0xff1111);
    pointLight.position.y = 3;

    this.pointLight = pointLight;
    const sphere = new Mesh(new SphereGeometry(0.2, 8, 8));
    sphere.name = 'sphere';
    sphere.position.set(pointLight.position.x, pointLight.position.y, pointLight.position.z);
    this.pointLightSphere = sphere;
    this.pointLight.add(sphere);

    this.scene.add(pointLight);

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshPhongMaterial({color: 0x6611dd, specular: 0x009900, shininess: 30, flatShading: true});
    this.cube = new Mesh(geometry, material);
    this.cube.castShadow = true;
    this.cube.receiveShadow = true;
    this.cube.position.y = 0.75;
    this.scene.add(this.cube);

    this.plane = this.createMandlebrotPlane();
    this.plane.rotation.x = -TAU;
    this.plane.rotation.z = -0.85 * Math.PI;
    this.plane.translateX(7.5);
    this.plane.translateY(0.5);

    this.plane.scale.setLength(0.7);
    this.plane.receiveShadow = true;
    this.scene.add(this.plane);

    this.lastFrameTime = 0;

    this.camera.lookAt(this.cube.position);

    this.animate(0);
  }

  private createLight(color) {
    const pointLight = new PointLight(color);
    pointLight.castShadow = true;
    pointLight.shadow.camera.near = 1;
    pointLight.shadow.camera.far = 60;
    pointLight.shadow.bias = -0.005; // reduces self-shadowing on double-sided objects
    return pointLight;
  }


  private animate(time?: number) {
    this.zone.runOutsideAngular(() => {
      this.resize();

      const frameTime = this.clock.getDelta();
      /*(this.checkerBoard.material as ShaderMaterial)
        .uniforms.zoom.value = Math.cos(time * 0.0001) * 0.1;*/

      this.cube.rotation.x += 0.5 * frameTime;
      this.cube.rotation.y += 0.5 * frameTime;

      this.pointLight.position.x = Math.sin(time * 0.0007) * 3;
      this.pointLight.position.y = 3 + Math.cos(time * 0.0005) * 2;
      this.pointLight.position.z = Math.cos(time * 0.0003) * 3;
      const pointLightColor = new Color(
        (Math.cos(time * 0.0003) + 1) * 0.5,
        (Math.sin(time * 0.0005) + 1) * 0.5,
        (Math.cos(time * 0.0007) + 1) * 0.5
      );
      this.pointLight.color.set(pointLightColor);

      const meshBasicMaterial = (this.pointLightSphere.material as MeshBasicMaterial);
      meshBasicMaterial.color.set(pointLightColor);

      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame((nextTime) => this.animate(nextTime));
    });
  }

  private createMandlebrotPlane(): Mesh {
    return new Mesh(new PlaneGeometry(100, 100, 1, 1), this.createMandelbrotMaterial());
  }

  private createMandelbrotMaterial(): ShaderMaterial {
    const uniforms = UniformsUtils
      .merge([
        UniformsLib['lights'],
        {zoom: {type: 'f', value: 0.05}}
      ]);

    return new ShaderMaterial({
      uniforms,
      vertexShader: MandelbrotVertex,
      fragmentShader: MandelbrotFragment,
      lights: true,
    });
  }

  // Resize by clientWidth and clientHeight
  private resize() {
    const canvas: HTMLCanvasElement = this.webGlCanvas.nativeElement;
    const width = Math.min(canvas.parentElement.clientWidth, 1024);
    const height = canvas.parentElement.clientHeight;
    if (width !== this.width ||
      height !== this.height) {
      this.renderer.setSize(width, height, true);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.width = width;
      this.height = height;
    }
  }
}
