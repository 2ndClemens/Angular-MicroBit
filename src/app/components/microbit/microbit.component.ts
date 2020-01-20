import { Component, ViewChild, OnInit } from '@angular/core';
import * as microbit from 'microbit-web-bluetooth';

@Component({
  selector: 'app-microbit',
  templateUrl: './microbit.component.html',
  styleUrls: ['./microbit.component.scss']
})
export class MicrobitComponent implements OnInit {
  services: any;
  microbitEvents = {
    accelerometerdatachanged: { x: 0, y: 0, z: 0 },
    buttonastatechanged: 0,
    buttonbstatechanged: 0,
    magnetometerdatachanged: { x: 0, y: 0, z: 0 },
    magnetometerbearingchanged: {}
  };
  @ViewChild('log', { static: true }) logEl;

  // const logEl = document.getElementById("log");
  log = message =>
    (this.logEl.innerHTML = `${message}\n${this.logEl.innerHTML}`);
  logJson = message => this.log(JSON.stringify(message, null, 2));
  eventHandler = event =>
    // console.log(`${event.type}: ${JSON.stringify(event.detail, null, 2)}`)
    (this.microbitEvents[event.type] = event.detail);

  constructor() {}

  ngOnInit() {}
  async findMicrobit() {
    const device = await microbit.requestMicrobit(window.navigator.bluetooth);
    if (device) {
      this.services = await microbit.getServices(device);
      if (this.services.deviceInformationService) {
        this.logJson(
          await this.services.deviceInformationService.readDeviceInformation()
        );
      }
      if (this.services.uartService) {
        this.services.uartService.addEventListener('receiveText', this.eventHandler);
        await this.services.uartService.send(
          new Uint8Array([104, 101, 108, 108, 111, 58])
        ); // hello:
      }
      if (this.services.ledService) {
        await this.services.ledService.writeMatrixState([
          [true, false, true, false, false],
          [true, true, true, true, true],
          [false, false, true, false, false],
          [false, true, false, true, false],
          [true, false, false, false, true]
        ]);
        this.logJson(await this.services.ledService.readMatrixState());
        await this.services.ledService.setScrollingDelay(50);
        this.log(await this.services.ledService.getScrollingDelay());
        await this.services.ledService.writeText('Web BLE');
      }
      if (this.services.buttonService) {
        this.services.buttonService.addEventListener(
          'buttonastatechanged',
          this.eventHandler
        );
        this.services.buttonService.addEventListener(
          'buttonbstatechanged',
          this.eventHandler
        );
      }
      if (this.services.temperatureService) {
        await this.services.temperatureService.setTemperaturePeriod(2000);
        this.log(await this.services.temperatureService.getTemperaturePeriod());
        this.services.temperatureService.addEventListener(
          'temperaturechanged',
          this.eventHandler
        );
      }
      if (this.services.accelerometerService) {
        await this.services.accelerometerService.setAccelerometerPeriod(80);
        this.log(await this.services.accelerometerService.getAccelerometerPeriod());
        this.services.accelerometerService.addEventListener(
          'accelerometerdatachanged',
          this.eventHandler
        );
      }
      if (this.services.magnetometerService) {
        const startMagnetometer = async () => {
          await this.services.magnetometerService.setMagnetometerPeriod(80);
          this.log(await this.services.magnetometerService.getMagnetometerPeriod());
          this.services.magnetometerService.addEventListener(
            'magnetometerdatachanged',
            this.eventHandler
          );
          this.services.magnetometerService.addEventListener(
            'magnetometerbearingchanged',
            this.eventHandler
          );
        };
        startMagnetometer();
        /* setTimeout(async () => {
          services.magnetometerService.addEventListener(
            'magnetometercalibrationchanged',
            async response => {
              if (response.detail === 2) {
                await startMagnetometer();
              }
            }
          );
          try {
            await services.magnetometerService.calibrate();
          } catch (e) {
            await startMagnetometer();
          }
        }, 4000); */
      }
    }
  }

  async showIcon(){
    if (this.services.ledService) {
      await this.services.ledService.writeMatrixState([
        [true, false, true, false, false],
        [true, true, true, true, true],
        [false, false, true, false, false],
        [false, true, false, true, false],
        [true, false, false, false, true]
      ]);
    }
  }
  async showIcon2(){
    if (this.services.ledService) {
      await this.services.ledService.writeMatrixState([
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, true, false, false],
        [false, true, false, true, false],
        [true, false, false, false, true]
      ]);
    }
  }
}
