import { Component, OnInit } from '@angular/core';
import { HistoryService } from 'src/app/services/history.service';
import { HistoryEntry } from '../../../../../../Shared/models/models/history-entry.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  public data:Array<HistoryEntry>;

  constructor(private historyService:HistoryService) { 
    this.data = [];
  }

  ngOnInit(): void {
    this.data = this.historyService.getHistory();
  }
}
