import { Injectable } from '@angular/core';
import { Sensor } from '../../../../../Shared/models/models/sensor.model';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private data:Array<Sensor>
  constructor() { 
    
    this.data = [
      new Sensor("Temperature",21.1),
      new Sensor("Humidity", 78),
      new Sensor("Luminosity", 65)
      // Add more 
    ];
  }

  public getSensorData():Array<Sensor>{
    console.log("Got into the sensor service ctr")
    return this.data;
  }
}
