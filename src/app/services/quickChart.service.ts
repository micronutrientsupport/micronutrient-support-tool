import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { BehaviorSubject, Observable, map } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const QuickChart = require('quickchart-js');

@Injectable()
export class QuickchartService {
  constructor(private http: HttpClient) {}

  private chartPNG = new BehaviorSubject<string>('');
  public chartPNGObs = this.chartPNG.asObservable();

  /**
   *
   * @param chartData - object containing type, data, labels and options for your chart
   * @param format - png or pdf
   * @returns string
   */
  public getChartAsImageUrl(chartData: Chart, format: string): string {
    const tmpChart = new QuickChart();
    // chartData.options.title.display = true; TODO: update
    tmpChart.setConfig(chartData);
    tmpChart.setWidth(700);
    tmpChart.setHeight(450);
    tmpChart.setFormat(format);
    const chartUrl: string = tmpChart.getUrl();

    return chartUrl;
  }

  /**
   *
   * @param image Chart.js API response in Blob format
   * @returns Promise
   */
  private createImageFromBlob(image: Blob): Promise<unknown> {
    const promise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };

      if (image) {
        reader.readAsDataURL(image);
      }
    });
    return promise;
  }

  /**
   *
   * @param chartData object containing type, data, labels and options for your chart
   * @param imgType png or pdf
   * @returns Observable
   */
  public postChartData(chartData: ChartConfiguration): Observable<Promise<unknown>> {
    const postData = {
      backgroundColor: '#fff',
      width: 1500,
      height: 750,
      devicePixelRatio: 1.0,
      chart: chartData,
    };
    return this.http
      .post('http://localhost:3400/chart', postData, { responseType: 'blob' })
      .pipe(map(this.createImageFromBlob));
  }
}
