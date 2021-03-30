import { Component, OnInit } from '@angular/core';
import { Sensor } from '../../../../../../Shared/models/models/sensor.model';
import { SensorService } from "../../services/sensor.service"

@Component({
  selector: 'app-sensor-table',
  templateUrl: './sensor-table.component.html',
  styleUrls: ['./sensor-table.component.scss']
})
export class SensorTableComponent implements OnInit {

  sensors: Array<Sensor> = [];
  constructor(private sensorService:SensorService) { }
  
  ngOnInit(): void {
    console.log("Got into the table component ngOnInit");
    this.sensors = this.sensorService.getSensorData();
    console.log(this.sensors);
  }

}
