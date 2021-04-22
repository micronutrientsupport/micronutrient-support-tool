/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as L from 'leaflet';
import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { MatTabGroup } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MonthlyFoodGroup } from 'src/app/apiAndObjects/objects/monthlyFoodGroup';
import { CardComponent } from 'src/app/components/card/card.component';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-biomarker-status',
  templateUrl: './biomarkerStatus.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './biomarkerStatus.component.scss']
})
export class BiomarkerStatusComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('map1') map1Element: ElementRef;

  @Input() card: CardComponent;

  public chartData: ChartJSObject;
  public dialogData: any;
  public title = 'Zinc Status - Adult Women';
  public dataSource: MatTableDataSource<MonthlyFoodGroup>;
  public displayedColumns = ['a', 'b', 'c', 'd'];
  public displayedColumns2 = ['a', 'b', 'c'];

  // Temporary data:
  public defThreshold = 20;
  public abnThreshold = 60;
  public showOutliers = false;
  public outlierControl = new FormControl(false);

  private biomarkerMap: L.Map;

  constructor() { }
  ngAfterViewInit(): void {

    console.log(this.randomValues(100, 0, 100));
    this.card.title = this.title;
    this.card.showExpand = true;
    this.biomarkerMap = this.initialiseMap(this.map1Element.nativeElement);

    this.chartData = {
      plugins: [ChartAnnotation],
      type: 'boxplot',
      data: {
        // define label tree
        labels: ['Central', 'North', 'South', 'South East', 'West'],
        datasets: [
          {
            label: 'Dataset 1',
            backgroundColor: 'rgba(0,220,255,0.5)',
            borderColor: 'rgba(0,220,255,0.5)',
            data: [
              [10, 20, 30, 40, 50, 15, 25, 35, 45, 55],
              this.randomValues(100, 0, 20),
              this.randomValues(100, 20, 70),
              this.randomValues(100, 60, 100),
              this.randomValues(40, 50, 100),
              this.randomValues(100, 60, 120)
            ],
          }
        ]
      },
      options: {
        annotation: {
          annotations: [
            {
              type: 'line',
              id: 'defLine',
              mode: 'horizontal',
              scaleID: 'y-axis-0',
              value: this.defThreshold,
              borderWidth: 2.0,
              borderColor: 'rgba(255,0,0,0.5)',
              outlierColor: 'rgba(0,0,0,0.3)',
              outlierRadius: 3,
              label: {
                enabled: true,
                content: 'Deficiency threshold',
                backgroundColor: 'rgba(255,0,0,0.8)'
              },
            },
            {
              type: 'line',
              id: 'abnLine',
              mode: 'horizontal',
              scaleID: 'y-axis-0',
              value: this.abnThreshold,
              borderWidth: 2.0,
              borderColor: 'rgba(0,0,255,0.5)',
              outlierColor: 'rgba(0,0,0,0.3)',
              outlierRadius: 3,
              label: {
                enabled: true,
                content: 'Threshold for abnormal values',
                backgroundColor: 'rgba(0,0,255,0.8)'
              },
            },
          ],
        },
      },
    };

  }

  public toggleShowOutlier(): void {
    this.showOutliers = this.outlierControl.value;
    console.log(this.showOutliers);
  }

  private initialiseMap(mapElement: HTMLElement): L.Map {
    const map = L.map(mapElement, {}).setView([6.6194073, 20.9367017], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    return map;
  }

  private randomValues(count: number, min: number, max: number): any {
    const delta = max - min;
    return Array.from({ length: count }).map(() => Math.random() * delta + min);
  }

}
