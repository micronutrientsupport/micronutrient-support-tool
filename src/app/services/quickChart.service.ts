import { Injectable } from '@angular/core';
import { ChartJSObject } from '../apiAndObjects/objects/misc/chartjsObject';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const QuickChart = require('quickchart-js');

@Injectable()
export class QuickchartService {
  constructor(private http: HttpClient) {}

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

  public getChartViaPost(chartData: ChartJSObject, format: string): Observable<unknown> {
    const body = {
      backgroundColor: '#fff',
      width: 1000,
      height: 500,
      format: format,
      chart: JSON.stringify(chartData),
    };
    return this.http.post('https://quickchart.io/chart/create', body);
  }
}
