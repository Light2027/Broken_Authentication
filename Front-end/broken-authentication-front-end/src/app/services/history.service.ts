import { Injectable } from '@angular/core';
import {HistoryEntry} from '../../../../../Shared/models/models/history-entry.model'

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private data:Array<HistoryEntry>

  constructor() {
    this.data = [
      new HistoryEntry(new Date(), "Test1"),
      new HistoryEntry(new Date(), "Test2"),
      new HistoryEntry(new Date(), "Test3"),
      new HistoryEntry(new Date(), "Test4"),
      new HistoryEntry(new Date(), "Test5"),
      new HistoryEntry(new Date(), "Test6"),
      new HistoryEntry(new Date(), "Test7"),
      new HistoryEntry(new Date(), "Test8"),
      new HistoryEntry(new Date(), "Test9"),
      new HistoryEntry(new Date(), "Test10"),
      new HistoryEntry(new Date(), "Test11"),
      new HistoryEntry(new Date(), "Test12"),
      new HistoryEntry(new Date(), "Test13"),
      new HistoryEntry(new Date(), "Test14"),
      new HistoryEntry(new Date(), "Test15"),
      new HistoryEntry(new Date(), "Test16"),
      new HistoryEntry(new Date(), "Test17"),
      new HistoryEntry(new Date(), "Test18"),
      new HistoryEntry(new Date(), "Test19"),
      new HistoryEntry(new Date(), "Test20"),
      new HistoryEntry(new Date(), "Test1"),
      new HistoryEntry(new Date(), "Test1"),
      new HistoryEntry(new Date(), "Test1"),
      new HistoryEntry(new Date(), "Test1"),
      new HistoryEntry(new Date(), "Test1"),
      new HistoryEntry(new Date(), "Test1"),
      new HistoryEntry(new Date(), "Test1"),
      new HistoryEntry(new Date(), "Test1"),
    ];
  }

  public getHistory():Array<HistoryEntry>{
    return this.data;
  }
}
