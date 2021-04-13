import { Injectable } from '@angular/core';
import {HistoryEntry} from '../../../../../Shared/models/models/history-entry.model'

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private data:Array<HistoryEntry>

  constructor() {
    this.data = [
      new HistoryEntry(new Date("09 04 2021"),"madA has signed up"),
      new HistoryEntry(new Date("29 03 2021"),"DefinetlyNotAdam has been removed by Admin"),
      new HistoryEntry(new Date("29 03 2021"),"Temperature threshold has been set to 21.1 C° by Admin"),
      new HistoryEntry(new Date("27 03 2021"),"Temperatur is below threshold by 8 C°"),
      new HistoryEntry(new Date("22 03 2021"),"Temperatur is below threshold by 10 C°"),
      new HistoryEntry(new Date("16 03 2021"),"Temperature threshold has been set to 40 C° by DefinetlyNotAdam"),
      new HistoryEntry(new Date("15 03 2021"),"DefinetlyNotAdam has signed up"),
      new HistoryEntry(new Date("13 03 2021"),"Humidity dipped below threshold by 30%"),
      new HistoryEntry(new Date("10 03 2021"),"Humidity threshold has been set to 78% by Admin"),
      new HistoryEntry(new Date("08 03 2021"),"Adam has been removed by Admin"),
      new HistoryEntry(new Date("06 03 2021"),"Temperature threshold has been set to 21.1 C° by Admin"),
      new HistoryEntry(new Date("19 02 2021"),"Temperature threshold has been set to 27 C° by Adam"),
      new HistoryEntry(new Date("12 02 2021"),"Temperature threshold has been set to 22 C° by Admin"),
      new HistoryEntry(new Date("10 02 2021"),"Temperature threshold has been set to 25 C° by Adam"),
      new HistoryEntry(new Date("07 02 2021"),"Humidity threshold has been set to 52% by Adam"),
      new HistoryEntry(new Date("01 02 2021"),"Adam has signed up"),
      new HistoryEntry(new Date("23 01 2021"),"Humidity levels reached maximum: 100%"),
      new HistoryEntry(new Date("23 01 2021"),"Light intensity threshold has been set to 63% by Admin"),
      new HistoryEntry(new Date("21 01 2021"),"Humidity levels below safe threshold (20%)"),
      new HistoryEntry(new Date("09 01 2021"),"Temperature Sensor: -2.0 C° :> Critical Temperature"),
    ];
  }

  public getHistory():Array<HistoryEntry>{
    return this.data;
  }
}
