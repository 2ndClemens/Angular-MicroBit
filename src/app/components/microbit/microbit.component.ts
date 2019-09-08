import { Component, ViewChild, OnInit } from '@angular/core';
import * as microbit from 'microbit-web-bluetooth';

@Component({
  selector: 'app-microbit',
  templateUrl: './microbit.component.html',
  styleUrls: ['./microbit.component.scss']
})
export class MicrobitComponent implements OnInit {
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
      const services = await microbit.getServices(device);
      if (services.deviceInformationService) {
        this.logJson(
          await services.deviceInformationService.readDeviceInformation()
        );
      }
      if (services.uartService) {
        services.uartService.addEventListener('receiveText', this.eventHandler);
        await services.uartService.send(
          new Uint8Array([104, 101, 108, 108, 111, 58])
        ); // hello:
      }
      if (services.ledService) {
        await services.ledService.writeMatrixState([
          [true, false, true, false, false],
          [true, true, true, true, true],
          [false, false, true, false, false],
          [false, true, false, true, false],
          [true, false, false, false, true]
        ]);
        this.logJson(await services.ledService.readMatrixState());
        await services.ledService.setScrollingDelay(50);
        this.log(await services.ledService.getScrollingDelay());
        await services.ledService.writeText('Web BLE');
      }
      if (services.buttonService) {
        services.buttonService.addEventListener(
          'buttonastatechanged',
          this.eventHandler
        );
        services.buttonService.addEventListener(
          'buttonbstatechanged',
          this.eventHandler
        );
      }
      if (services.temperatureService) {
        await services.temperatureService.setTemperaturePeriod(2000);
        this.log(await services.temperatureService.getTemperaturePeriod());
        services.temperatureService.addEventListener(
          'temperaturechanged',
          this.eventHandler
        );
      }
      if (services.accelerometerService) {
        await services.accelerometerService.setAccelerometerPeriod(80);
        this.log(await services.accelerometerService.getAccelerometerPeriod());
        services.accelerometerService.addEventListener(
          'accelerometerdatachanged',
          this.eventHandler
        );
      }
      if (services.magnetometerService) {
        const startMagnetometer = async () => {
          await services.magnetometerService.setMagnetometerPeriod(80);
          this.log(await services.magnetometerService.getMagnetometerPeriod());
          services.magnetometerService.addEventListener(
            'magnetometerdatachanged',
            this.eventHandler
          );
          services.magnetometerService.addEventListener(
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
}
