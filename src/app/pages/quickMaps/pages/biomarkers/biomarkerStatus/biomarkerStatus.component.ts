/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as L from 'leaflet';
import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
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
  public displayedColumns = ['a', 'b', 'c', 'd'];
  public displayedColumns2 = ['a', 'b', 'c'];
  public defThreshold = 20;
  public abnThreshold = 60;
  public showOutliers = false;
  public outlierControl = new FormControl(false);
  public dataTypes = new FormControl();
  public characteristics = new FormControl();
  public dataList: string[] = ['Deficiency', 'Excess', 'Combined deficiency and excess', 'Continuous Data'];
  public characteristicList: string[] = ['Regions', 'Residence', 'Age group', 'Wealth Quintiles', 'All characteristics', 'Total'];
  public totalSamples = 6587;
  public selectedOption: any;
  public selectedCharacteristic: any;

  private biomarkerMap: L.Map;

  constructor() { }
  ngAfterViewInit(): void {

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
            label: 'Zinc',
            backgroundColor: 'rgba(0,220,255,0.5)',
            borderColor: 'rgba(0,220,255,0.5)',
            outlierColor: 'rgba(0,0,0,0.2)',
            outlierRadius: 3,
            data: [
              this.randomBoxPlot(0, 100),
              this.randomBoxPlot(0, 20),
              this.randomBoxPlot(20, 70),
              this.randomBoxPlot(60, 100),
              this.randomBoxPlot(50, 100),
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

    console.log(this.chartData.data.datasets[0].data[0]);

  }

  // Show/remove outlier data on boxplot.
  public toggleShowOutlier(): void {
    this.showOutliers = this.outlierControl.value;
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 0) {
      this.biomarkerMap.invalidateSize();
    }
  }

  // Capture value from data select dropdown.
  private dataSelected(value: any) {
    this.selectedOption = value;
    console.log(value);
  }

  // Capture value from characteristic select dropdown in table tab.
  private charactersiticSelected(value: any) {
    this.selectedCharacteristic = value;
    console.log(value);
    if (this.selectedOption) {
      // do something
    }
  }

  private randomValues(count: number, min: number, max: number) {
    const delta = max - min;
    return Array.from({ length: count }).map(() => Math.random() * delta + min);
  }

  // Return the correct interface to dislpay outliers
  private randomBoxPlot(min: any, max: any) {
    const values = this.randomValues(6, min, max).sort((a, b) => a - b);

    return {
      min: values[0],
      q1: values[1],
      median: values[2],
      q3: values[3],
      max: values[4],
      outliers: Array(20).fill(1).map(() => Math.round(Math.random() * 120))
    };
  }

  private initialiseMap(mapElement: HTMLElement): L.Map {
    const map = L.map(mapElement, {}).setView([6.6194073, 20.9367017], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    return map;
  }


}
