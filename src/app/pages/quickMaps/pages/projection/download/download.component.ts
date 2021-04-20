/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
const QuickChart = require('quickchart-js');
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './download.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadComponent implements OnInit {
  @Input() chartToRender: ChartJSObject;
  constructor() {}
  ngOnInit(): void {
    const myChart = new QuickChart();
    myChart.setConfig(this.chartToRender);
    console.log(myChart.getUrl());
  }
}
