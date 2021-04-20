/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { MatTabGroup } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MonthlyFoodGroup } from 'src/app/apiAndObjects/objects/monthlyFoodGroup';
@Component({
  selector: 'app-biomarker-status',
  templateUrl: './biomarkerStatus.component.html',
  styleUrls: ['./biomarkerStatus.component.scss']
})
export class BiomarkerStatusComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort: MatSort;
  public chartData: ChartJSObject;
  public dialogData: any;
  public title = 'Biomarker Status';
  public dataSource: MatTableDataSource<MonthlyFoodGroup>;

  public displayedColumns = [
    'a',
    'b',
    'c',
    'd'
  ];

  public displayedColumns2 = [
    'a',
    'b',
    'c'
  ];

  constructor() { }
  ngAfterViewInit(): void {

    this.chartData = {
      type: 'boxplot',
      data: {
        // define label tree
        labels: ['Central', 'North', 'South', 'South East', 'West'],
        datasets: [
          {
            label: 'Dataset 1',
            backgroundColor: () => 'rgba(255,0,0,0.5)',
            borderColor: 'red',
            data: [
              this.randomValues(100, 0, 100),
              this.randomValues(100, 0, 20),
              this.randomValues(100, 20, 70),
              this.randomValues(100, 60, 100),
              this.randomValues(40, 50, 100),
              this.randomValues(100, 60, 120)
            ]
          },
          {
            label: 'Dataset 2',
            backgroundColor: () => 'rgba(0,0,255,0.5)',
            borderColor: 'blue',
            data: [
              this.randomValues(100, 60, 100),
              this.randomValues(100, 0, 100),
              this.randomValues(100, 0, 20),
              this.randomValues(100, 20, 70),
              this.randomValues(40, 60, 120)
            ]
          }
        ]
      },
      options: {
      },
    };

  }

  randomValues(count: number, min: number, max: number): any {
    const delta = max - min;
    return Array.from({ length: count }).map(() => Math.random() * delta + min);
  }

}
