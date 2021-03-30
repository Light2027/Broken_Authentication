import { Component, OnInit } from '@angular/core';
import {SliderModule} from 'primeng/slider';

@Component({
  selector: 'app-sensor-controller',
  templateUrl: './sensor-controller.component.html',
  styleUrls: ['./sensor-controller.component.scss']
})
export class SensorControllerComponent implements OnInit {

  temperature : number = 20;
  constructor() { }

  ngOnInit(): void {
  }

}
