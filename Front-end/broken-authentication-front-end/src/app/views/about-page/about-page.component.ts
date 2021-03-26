import { Component, OnInit } from '@angular/core';
import { version } from '../../../../package.json';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit {
  public version:string;
  constructor() {
    this.version = version;
   }

  ngOnInit(): void {
  }

}
