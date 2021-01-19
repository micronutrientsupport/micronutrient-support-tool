/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

import { BorderWidth, Chart, Point, ChartColor } from 'chart.js';
@Component({
  selector: 'app-chart-card',
  templateUrl: './chartCard.component.html',
  styleUrls: ['./chartCard.component.scss'],
})
export class ChartCardComponent implements OnInit {
  public meatva = [];
  public totalva = [];
  public labels = [];
  public bin = [];
  public frequency = [];

  // chartjs
  public graphStyle = {
    display: 'block',
    color: '#098',
  };

  public data = {
    labels: this.labels,
    datasets: [
      // {
      //   label: 'People per Household',
      //   data: this.labels,
      // },
      {
        label: 'Vitamin A from Meat',
        backgroundColor: 'red',
        data: this.meatva,
        pointBackgroundColor: 'red',
      },
      {
        label: 'Total Vitamin A',
        backgroundColor: 'blue',
        data: this.totalva,
        pointBackgroundColor: 'blue',
      },
    ],
  };

  public histoGraphStyle = {
    display: 'block',
    color: '#098',
  };

  public jsdata = {
    datasets: [
      {
        label: 'Frequency',
        data: this.frequency,
      },
      {
        label: 'bin',
        data: this.bin,
        marker: { color: 'red' },
      },
      // {
      //   label: 'Total Vitamin A',
      //   data: this.totalva,
      // },
    ],
  };
  constructor(private http: HttpClient, private papa: Papa, private dialogService: DialogService) {}

  ngOnInit(): void {
    void this.http.get('./assets/dummyData/trial_data_truncated.csv', { responseType: 'text' }).subscribe((data) => {
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

    void this.http
      .get('./assets/dummyData/household_histogram.json', { responseType: 'json' })
      .subscribe((data: any) => {
        console.log(data[0].data);
        const rawDataArray = data[0].data;

        rawDataArray.forEach((item) => {
          this.bin.push(Number(item.bin));
        });

        rawDataArray.forEach((item) => {
          this.frequency.push(Number(item.frequency));
        });
        console.log(this.frequency, this.bin);
        // rawDataArray.forEach((item) => {
        //   this.labels.push(item.pc);
        // });
      });
  }
  public openDialog(): void {
    void this.dialogService.openChartDialog(this.jsdata);
  }
}
