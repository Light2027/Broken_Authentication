import { Component, OnInit } from '@angular/core';
import { Sensor } from '../../../../../../Shared/models/models/sensor.model';
import { SensorService } from "../../services/sensor.service"


@Component({
  selector: 'app-sensor-controller',
  templateUrl: './sensor-controller.component.html',
  styleUrls: ['./sensor-controller.component.scss']
})
export class SensorControllerComponent implements OnInit {

  sensors: Array<Sensor> = [];
  constructor(private sensorService:SensorService) { }

  ngOnInit(): void {
    console.log("Got into the table component ngOnInit");
    this.sensors = this.sensorService.getSensorData();
    console.log(this.sensors);
  }

}
