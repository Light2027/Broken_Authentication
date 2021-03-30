import { Component, OnInit } from '@angular/core';
import { SensorService } from 'src/app/services/sensor.service';
import { Sensor } from '../../../../../../Shared/models/models/sensor.model';

@Component({
  selector: 'app-sensors-table',
  templateUrl: './sensors-table.component.html',
  styleUrls: ['./sensors-table.component.scss']
})
export class SensorsTableComponent implements OnInit {

  public data:Array<Sensor>

  constructor(private sensorService:SensorService) { 
    this.data = [];
  }

  ngOnInit(): void {
    this.data = this.sensorService.getSensorData();
  }
}
