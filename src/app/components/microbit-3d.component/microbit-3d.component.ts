import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  Input
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-microbit-3d',
  templateUrl: './microbit-3d.component.html',
  styleUrls: ['./microbit-3d.component.scss']
})
export class Microbit3dComponent implements OnInit {
  @Input() rotation: any = { x: 0, y: 0, z: 0 };
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  cube: THREE.Mesh;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @ViewChild('canvas', { static: true }) private canvasRef: ElementRef;
  @HostListener('window:resize', ['$event'])
  onResizeWindow() {
    this.onResize();
  }

  constructor() {}

  ngOnInit() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      // precision: 'mediump',
      alpha: false
    });
    this.renderer.setClearColor(0xffffff, 1);

    this.camera = new THREE.PerspectiveCamera(
      40,
      this.canvas.width / this.canvas.height,
      1,
      1000
    );
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 50;

    const geometry = new THREE.BoxGeometry(15, 10, 0.3);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    this.onResize();
    this.animate();
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // const roll = Math.atan2(this.rotation.y , this.rotation.z) * 57.3;
    // const pitch = Math.atan2((- this.rotation.x) , Math.sqrt(this.rotation.y * this.rotation.y + this.rotation.z * this.rotation.z)) * 57.3;

    /*  this.cube.rotation.x = -roll/360*Math.PI*2;
    this.cube.rotation.y = pitch/360*Math.PI*2; */
    //  this.cube.rotation.z = -this.bearing/360*Math.PI*2;

    const pitch =
      ((Math.atan(
        this.rotation.x /
          Math.sqrt(Math.pow(this.rotation.y, 2) + Math.pow(this.rotation.z, 2))
      ) *
        57.3) /
        360) *
      Math.PI *
      2;
    const roll =
      ((Math.atan(
        this.rotation.y /
          Math.sqrt(Math.pow(this.rotation.x, 2) + Math.pow(this.rotation.z, 2))
      ) *
        57.3) /
        360) *
      Math.PI *
      2;
    const jaw =
      ((Math.atan(
        this.rotation.z /
          Math.sqrt(Math.pow(this.rotation.x, 2) + Math.pow(this.rotation.y, 2))
      ) *
        57.3) /
        360) *
      Math.PI *
      2;

    this.cube.rotation.x = this.lowPass(roll, this.cube.rotation.x);
    this.cube.rotation.y = this.lowPass(pitch, this.cube.rotation.y);
    // this.cube.rotation.z = this.lowPass(jaw, this.cube.rotation.z);

    // this.cube.rotation.x = (this.rotation.y * Math.PI) / 2;
    // this.cube.rotation.y = (this.rotation.x * Math.PI) / 2;
    // this.cube.rotation.z = (this.rotation.z * Math.PI) / 2;
    this.cube.rotation.order = 'XYZ';
    this.renderer.render(this.scene, this.camera);
  }

  private getAspectRatio() {
    return window.innerWidth / window.innerHeight;
  }

  public onResize() {
    this.camera.aspect = this.getAspectRatio();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.zoom = window.innerWidth / window.innerHeight / 1.7;
    this.camera.updateProjectionMatrix();
  }

  public lowPass(input, output) {
    // console.log(output);

    if (!output) {
      return input;
    }

    output = output + 0.15 * (input - output);

    return output;
  }
}
