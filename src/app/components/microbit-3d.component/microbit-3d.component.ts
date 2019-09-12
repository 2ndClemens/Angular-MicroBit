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
  @Input() pressA: number;
  @Input() pressB: number;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  cube: THREE.Mesh;
  buttonA: THREE.Mesh;
  buttonB: THREE.Mesh;
  leds: THREE.Mesh[] = [];
  matterialButtonActive = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  matterialButton = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  matterialLed = new THREE.MeshBasicMaterial({ color: 0x0000ff });

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @ViewChild('canvas', { static: true }) private canvasRef: ElementRef;
  @HostListener('window:resize')
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

    const geometry2 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    this.buttonA = new THREE.Mesh(geometry2, this.matterialButton);
    this.buttonA.translateX(-5);
    this.buttonA.translateZ(0.3);
    this.cube.add(this.buttonA);

    this.buttonB = new THREE.Mesh(geometry2, this.matterialButton);
    this.buttonB.translateX(5);
    this.buttonB.translateZ(0.3);
    this.cube.add(this.buttonB);
    this.onResize();
    this.animate();

    const geometry3 = new THREE.BoxGeometry(0.3, 0.5, 0.5);
    for (let n = 0; n < 5; n++) {
      for (let m = 0; m < 5; m++) {
        this.leds.push(new THREE.Mesh(geometry3, this.matterialLed));
        this.leds[this.leds.length - 1].translateX(-n + 2);
        this.leds[this.leds.length - 1].translateZ(-m + 2);
        this.leds[this.leds.length - 1].translateZ(0.3);
        this.cube.add(this.leds[this.leds.length - 1]);
      }
    }
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

    if (this.rotation.z < 0) {
      if (roll > this.cube.rotation.x + Math.PI) {
        this.cube.rotation.x += Math.PI * 2;
      }

      this.cube.rotation.x = this.lowPass(roll, this.cube.rotation.x);
    } else {
      if (-roll - Math.PI < this.cube.rotation.x - Math.PI) {
        this.cube.rotation.x -= Math.PI * 2;
      }
      this.cube.rotation.x = this.lowPass(
        -roll - Math.PI,
        this.cube.rotation.x
      );
    }

    // if (this.rotation.z < 0) {
    // console.log(pitch);
    if (pitch > this.cube.rotation.y + Math.PI) {
      this.cube.rotation.y += Math.PI * 2;
    }
    if (pitch < this.cube.rotation.y - Math.PI) {
      this.cube.rotation.y -= Math.PI * 2;
    }

    this.cube.rotation.y = this.lowPass(pitch, this.cube.rotation.y);
    // } else {
    /* if (-pitch - Math.PI < this.cube.rotation.y - Math.PI ) {
        this.cube.rotation.y -= Math.PI * 2;
      } */
    /* this.cube.rotation.y = this.lowPass(
        pitch ,
        this.cube.rotation.y
      ); */

    // console.log(this.cube.rotation.x);
    // this.cube.rotation.y = this.lowPass(pitch, this.cube.rotation.y);
    // this.cube.rotation.z = this.lowPass(jaw, this.cube.rotation.z);

    // this.cube.rotation.x = (this.rotation.y * Math.PI) / 2;
    // this.cube.rotation.y = (this.rotation.x * Math.PI) / 2;
    // this.cube.rotation.z = (this.rotation.z * Math.PI) / 2;
    this.cube.rotation.order = 'XYZ';
    if (this.pressA > 0) {
      this.buttonA.material = this.matterialButtonActive;
    } else {
      this.buttonA.material = this.matterialButton;
    }
    if (this.pressB > 0) {
      this.buttonB.material = this.matterialButtonActive;
    } else {
      this.buttonB.material = this.matterialButton;
    }
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
