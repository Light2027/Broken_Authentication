import { Component, OnInit } from '@angular/core';
import { Sensor } from '../../../../../../Shared/models/models/sensor.model';
import { SensorService} from "../../services/sensor.service"

@Component({
  selector: 'app-sensor-table',
  templateUrl: './sensor-table.component.html',
  styleUrls: ['./sensor-table.component.scss']
})
export class SensorTableComponent implements OnInit {

  
  constructor(private sensorService:SensorService, public sensors:Array<Sensor>) { }
  
  ngOnInit(): void {
    this.sensors = this.sensorService.getSensorData();
    console.log(this.sensors);
  }

}
