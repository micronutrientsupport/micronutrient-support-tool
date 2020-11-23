/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chartCard.component.html',
  styleUrls: ['./chartCard.component.scss'],
})
export class ChartCardComponent implements OnInit {
  public meatva = [];
  public totalva = [];
  public labels = [];
  //PLOTLY GRAPH
  public graph = {
    data: [{ x: this.meatva, y: this.labels, type: 'scatter', mode: 'markers', marker: { color: 'red' } }],
    layout: { width: '100%', height: '100%' },
  };

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
    void this.http
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
          this.labels.push(item.pc);
        });
      });
  }
}
