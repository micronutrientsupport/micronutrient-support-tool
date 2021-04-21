/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@angular/core';
import { ChartJSObject } from '../apiAndObjects/objects/misc/chartjsObject';
const QuickChart = require('quickchart-js');

@Injectable()
export class QuickchartService {
  constructor() {}
  /**
   *
   * @param chartData - object containing type, data, labels and options for your chart
   * @param format - png or pdf
   * @returns
   */
  public getChartAsImageUrl(chartData: ChartJSObject, format: string): string {
    const tmpChart = new QuickChart();
    chartData.options.title.display = true;
    tmpChart.setConfig(chartData);
    tmpChart.setFormat(format);
    const chartUrl: string = tmpChart.getUrl();

    return chartUrl;
  }
}
