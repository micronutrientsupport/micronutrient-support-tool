import { Injectable } from '@angular/core';
import { ChartJSObject } from '../apiAndObjects/objects/misc/chartjsObject';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const QuickChart = require('quickchart-js');

@Injectable()
export class QuickchartService {
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
    tmpChart.setWidth(700);
    tmpChart.setHeight(450);
    tmpChart.setFormat(format);
    const chartUrl: string = tmpChart.getUrl();

    return chartUrl;
  }
}
