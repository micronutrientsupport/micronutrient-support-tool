/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@angular/core';
import { ChartJSObject } from '../apiAndObjects/objects/misc/chartjsObject';
const QuickChart = require('quickchart-js');

@Injectable()
export class QuickchartService {
  constructor() {}

  public getChartAsImageUrl(chartData: ChartJSObject): string {
    const tmpChart = new QuickChart();
    tmpChart.setConfig(chartData);
    const chartUrl: string = tmpChart.getUrl();
    console.log(chartUrl);
    return chartUrl;
  }
}
