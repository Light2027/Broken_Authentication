import { Injectable } from '@angular/core';
import { Sensor } from '../../../../../Shared/models/models/sensor.model';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private data:Array<Sensor>
  constructor() { 
    this.data = [
      new Sensor(1,2,3),
      new Sensor(1,2,3),
      new Sensor(1,2,3),
      new Sensor(1,2,3),
      new Sensor(1,2,3),
      new Sensor(1,2,3),
      new Sensor(1,2,3),
      new Sensor(1,2,3),
      new Sensor(1,2,3),
      // Add more 
    ];
  }

  public getSensorData():Array<Sensor>{
    return this.data;
  }
}
