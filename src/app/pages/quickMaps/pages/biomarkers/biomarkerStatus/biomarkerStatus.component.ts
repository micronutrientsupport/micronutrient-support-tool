/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as L from 'leaflet';
import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { MatTabGroup } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MonthlyFoodGroup } from 'src/app/apiAndObjects/objects/monthlyFoodGroup';
import { CardComponent } from 'src/app/components/card/card.component';
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
  private biomarkerMap: L.Map;

  constructor() { }
  ngAfterViewInit(): void {
    this.card.title = this.title;
    this.card.showExpand = true;
    this.biomarkerMap = this.initialiseMap(this.map1Element.nativeElement);

    this.chartData = {
      type: 'boxplot',
      data: {
        // define label tree
        labels: ['Central', 'North', 'South', 'South East', 'West'],
        datasets: [
          {
            label: 'Dataset 1',
            backgroundColor: () => 'rgba(220,0,255,0.5)',
            borderColor: 'rgba(220,0,255,0.5)',
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
            backgroundColor: () => 'rgba(0,220,255,0.5)',
            borderColor: 'rgba(0,220,255,0.5)',
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
