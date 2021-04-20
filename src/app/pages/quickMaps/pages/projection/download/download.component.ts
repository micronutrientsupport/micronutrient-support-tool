/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './download.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {
    // const myChart = new QuickChart();
    // myChart.setConfig(this.chartToRender);
    // console.log(myChart.getUrl());
  }
}
