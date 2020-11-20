import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-baseline-details',
  templateUrl: './baselineDetails.component.html',
  styleUrls: ['./baselineDetails.component.scss'],
})
export class BaselineDetailsComponent implements OnInit {
  public meatva = [];
  public totalva = [];
  public labels = [];

  // showYAxisLabel: boolean = true;
  // showXAxisLabel: boolean = true;
  // xAxisLabel: string = 'Vitamin A from Meat';
  // yAxisLabel: string = 'Vitamin A total';
  public graphStyle = {
    display: 'block',
    height: '430px',
    width: '860px',
    color: '#254',
  };

  public data = {
    labels: this.labels,
    datasets: [
      {
        color: 'blue',
        label: 'Vitamin A from Meat',
        data: this.meatva,
      },
      {
        label: 'Total Vitamin A',
        data: this.totalva,
      },
    ],
  };
  constructor(private http: HttpClient, private papa: Papa) {}

  ngOnInit(): void {
    this.http
      .get('./assets/dummyData/trial_data.csv', { responseType: 'text' })
      .toPromise()
      .then((data) => {
        const rawData = this.papa.parse(data, { header: true });
        const rawDataArray = rawData.data;

        rawDataArray.forEach((item) => {
          this.meatva.push(Number(item['va.meat']));
        });

        rawDataArray.forEach((item) => {
          this.totalva.push(Number(item['va.supply']));
        });

        rawDataArray.forEach((item) => {
          this.labels.push(item['pc']);
        });

        console.debug(this.totalva);
      });
  }
}
