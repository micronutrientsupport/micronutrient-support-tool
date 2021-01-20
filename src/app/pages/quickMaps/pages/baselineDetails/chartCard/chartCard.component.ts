/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chartCard.component.html',
  styleUrls: ['./chartCard.component.scss'],
})
export class ChartCardComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
  }

  public paginator: MatPaginator;
  public sort: MatSort;

  public labels = [];
  public bin = [];
  public frequency = [];
  public threshold: number;
  public chartData;

  public displayedColumns = ['bin', 'frequency'];

  public dataSource = new MatTableDataSource();

  constructor(private http: HttpClient, private papa: Papa, private dialogService: DialogService) { }

  ngOnInit(): void {
    void this.http
      .get('./assets/dummyData/household_histogram.json', { responseType: 'json' })
      .subscribe((data: any) => {
        const rawDataArray = data[0].data;
        const threshold = data[0].adequacy_threshold;
        this.threshold = Number(threshold);

        rawDataArray.forEach((item) => {
          this.bin.push(Number(item.bin));
        });

        rawDataArray.forEach((item) => {
          this.frequency.push(Number(item.frequency));
        });
        this.initialiseGraph();
        this.initialiseTable(rawDataArray);
      });
  }

  public openDialog(): void {
    void this.dialogService.openChartDialog({});
  }

  public initialiseGraph(): void {
    this.chartData = {
      plugins: [ChartAnnotation],
      type: 'bar',
      data: {
        labels: this.bin,
        datasets: [
          {
            label: 'Frequency',
            data: this.frequency,
            borderColor: '#ff6384',
            backgroundColor: '#ff6384',
            fill: true,
          },
        ],
      },
      options: {
        legend: {
          display: true,
        },
        scales: {
          xAxes: [
            {
              display: true,
            },
          ],
          yAxes: [
            {
              display: true,
              id: 'y-axis-0',
            },
          ],
        },
        annotation: {
          annotations: [
            {
              type: 'line',
              id: 'hLine',
              mode: 'horizontal',
              scaleID: 'y-axis-0',
              value: this.threshold, // data-value at which the line is drawn
              borderWidth: 2.5,
              borderColor: 'black',
              label: {
                enabled: true,
                content: 'Threshold',
              },
            },
          ],
        },
      },
    };
  }

  public initialiseTable(data: Array<any>): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
