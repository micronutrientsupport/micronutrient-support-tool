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

  public graph = {
    data: [
      {
        x: this.meatva,
        y: this.labels,
        type: 'scatter',
        mode: 'markers',
        marker: {
          color: 'red',
        },
        xaxis: { text: 'x Axis', color: 'black' },
      },
    ],
    layout: {
      autosize: false,
      height: 270,
      yaxis: {
        title: {
          text: 'People per Household',
          titlefont: {
            family: 'Arial, sans-serif',
            size: 18,
            color: 'lightgrey',
          },
        },
      },
      xaxis: {
        title: {
          text: 'Vitamin A from Meat (μg)',
          titlefont: {
            family: 'Arial, sans-serif',
            size: 18,
            color: 'lightgrey',
          },
        },
      },
    },
  };

  // chartjs
  public graphStyle = {
    display: 'block',
    color: '#098',
  };

  public data = {
    labels: this.labels,
    datasets: [
      {
        label: 'People per Household',
        data: this.labels,
      },
      {
        label: 'Vitamin A from Meat',
        data: this.meatva,
        marker: { color: 'red' },
      },
      // {
      //   label: 'Total Vitamin A',
      //   data: this.totalva,
      // },
    ],
  };
  constructor(private http: HttpClient, private papa: Papa) { }

  ngOnInit(): void {
    void this.http
      .get('./assets/dummyData/trial_data_truncated.csv', { responseType: 'text' })
      .subscribe((data) => {
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
