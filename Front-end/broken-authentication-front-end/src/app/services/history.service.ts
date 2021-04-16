import { Injectable } from '@angular/core';
import {HistoryEntry} from '../../../../../Shared/models/models/history-entry.model'

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private data:Array<HistoryEntry>

  constructor() {
    this.data = [
      new HistoryEntry(new Date("2021-04-14T03:00:39.028Z"),"madA has signed up"),
      new HistoryEntry(new Date("2021-04-13T23:16:48.728Z"),"DefinetlyNotAdam has been removed by Admin"),
      new HistoryEntry(new Date("2021-04-12T23:46:54.980Z"),"Temperature threshold has been set to 21.1 C° by Admin"),
      new HistoryEntry(new Date("2021-04-09T11:28:08.484Z"),"Temperatur is below threshold by 8 C°"),
      new HistoryEntry(new Date("2021-04-08T03:11:28.354Z"),"Temperatur is below threshold by 10 C°"),
      new HistoryEntry(new Date("2021-04-05T19:27:30.324Z"),"Temperature threshold has been set to 40 C° by DefinetlyNotAdam"),
      new HistoryEntry(new Date("2021-04-05T17:03:15.453Z"),"DefinetlyNotAdam has signed up"),
      new HistoryEntry(new Date("2021-03-24T05:27:26.036Z"),"Humidity dipped below threshold by 30%"),
      new HistoryEntry(new Date("2021-03-14T17:43:52.867Z"),"Humidity threshold has been set to 78% by Admin"),
      new HistoryEntry(new Date("2021-03-10T08:43:44.356Z"),"Adam has been removed by Admin"),
      new HistoryEntry(new Date("2021-03-10T07:41:17.347Z"),"Temperature threshold has been set to 21.1 C° by Admin"),
      new HistoryEntry(new Date("2021-03-07T01:08:46.750Z"),"Temperature threshold has been set to 27 C° by Adam"),
      new HistoryEntry(new Date("2021-03-01T01:12:31.126Z"),"Temperature threshold has been set to 22 C° by Admin"),
      new HistoryEntry(new Date("2021-02-22T21:33:50.635Z"),"Temperature threshold has been set to 25 C° by Adam"),
      new HistoryEntry(new Date("2021-02-01T00:05:14.254Z"),"Humidity threshold has been set to 52% by Adam"),
      new HistoryEntry(new Date("2021-01-31T14:53:37.600Z"),"Adam has signed up"),
      new HistoryEntry(new Date("2021-01-31T00:12:21.637Z"),"Humidity levels reached maximum: 100%"),
      new HistoryEntry(new Date("2021-01-27T15:23:33.550Z"),"Light intensity threshold has been set to 63% by Admin"),
      new HistoryEntry(new Date("2021-01-15T19:52:31.052Z"),"Humidity levels below safe threshold (20%)"),
      new HistoryEntry(new Date("2021-01-02T10:59:31.012Z"),"Temperature Sensor: -2.0 C° :> Critical Temperature"),
    ];
  }

  public getHistory():Array<HistoryEntry>{
    return this.data;
  }
}
