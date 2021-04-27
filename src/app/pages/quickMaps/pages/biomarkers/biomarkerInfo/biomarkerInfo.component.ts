/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { MatTableDataSource } from '@angular/material/table';
import { Component, AfterViewInit, ViewChild, ElementRef, Input, Inject, Optional } from '@angular/core';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
// import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatTabGroup } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { CardComponent } from 'src/app/components/card/card.component';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { ChangeDetectorRef } from '@angular/core';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-biomarker-info',
  templateUrl: './biomarkerInfo.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './biomarkerInfo.component.scss'],
})
export class BiomarkerInfoComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort: MatSort;

  @Input() card: CardComponent;
  static additionalData: any;
  constructor(
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private papa: Papa,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<AdditionalInformationDialogData>,
  ) {}
  public chartData: ChartJSObject;
  public title = 'Additional Information';

  public defThreshold = 60;
  public abnThreshold = 170;
  public labels: Array<string>;
  public binData: Array<number>;

  public data: Array<AdditionalInformationData>;
  public dataSource = new MatTableDataSource();

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();
  private openDialog(): void {
    void this.dialogService.openDialogForComponent<AdditionalInformationDialogData>(BiomarkerInfoComponent, {
      data: null,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }

  ngAfterViewInit(): void {
    this.getDataFromCSV();
    setTimeout(() => {
      this.createBins();
      this.setChart();
    }, 1000);
    this.card.title = this.title;
    this.card.showExpand = true;
    this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

    this.subscriptions.push(this.card.onExpandClickObs.subscribe(() => this.openDialog()));
  }

  private setChart() {
    this.chartData = {
      plugins: [ChartAnnotation],
      type: 'bar',
      data: {
        // define labels
        // labels: [0, 25, 50, 75, 100, 125, 150, 175, 200],
        // labels: ['0-25', '25-50', '50-75', '75-100', '100-125', '125-150'],
        labels: this.labels,

        datasets: [
          {
            label: 'Zinc',
            backgroundColor: 'rgba(0,220,255,0.5)',
            borderColor: 'rgba(0,220,255,0.5)',
            outlierColor: 'rgba(0,0,0,0.5)',
            outlierRadius: 4,
            // data: [[80], [120], [60], [0, 160], [0, 250]],
            // data: this.createBins(),
            data: this.binData,
            // data: AgeGenderGroup[]
          },
        ],
      },
      options: {
        annotation: {
          annotations: [
            {
              type: 'line',
              id: 'defLine',
              mode: 'vertical',
              scaleID: 'y-axis-0',
              value: this.defThreshold,
              borderWidth: 2.0,
              borderColor: 'rgba(255,0,0,0.5)',
              label: {
                enabled: true,
                content: 'Deficiency threshold',
                backgroundColor: 'rgba(255,0,0,0.8)',
              },
            },
            {
              type: 'line',
              id: 'abnLine',
              mode: 'vertical',
              scaleID: 'y-axis-0',
              value: this.abnThreshold,
              borderWidth: 2.0,
              borderColor: 'rgba(0,0,255,0.5)',
              label: {
                enabled: true,
                content: 'Threshold for abnormal values',
                backgroundColor: 'rgba(0,0,255,0.8)',
              },
            },
          ],
        },
      },
    };
  }

  private createBins(): void {
    // Set bins
    const arr = this.data.map((item: AdditionalInformationData) => item.zincLevelOne);

    const bins = [];
    let binCount = 0;
    const interval = 25;
    const numOfBuckets = 150;
    // const numOfBuckets = Math.max(this.data.zincLevelOne);
    // console.log(Math.max(this.data.zincLevelOne));

    // Setup Bins
    for (let i = 0; i < numOfBuckets; i += interval) {
      bins.push({
        binNum: binCount,
        minNum: i,
        maxNum: i + interval,
        count: 0,
      });
      binCount++;
    }

    // Loop through data and add to bin's count
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let j = 0; j < bins.length; j++) {
        const bin = bins[j];
        if (item > bin.minNum && item <= bin.maxNum) {
          bin.count++;
        }
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    this.labels = bins.map((item: any) => item.binNum);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    this.binData = bins.map((item: any) => item.count);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    this.labels = bins.map((item: any) => `${item.minNum}-${item.maxNum}`);
    // console.debug(bins);
  }

  private getDataFromCSV(): void {
    void this.http
      .get('./assets/dummyData/FakeBiomarkerDataForDev.csv', { responseType: 'text' })
      .toPromise()
      .then((data: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const blob = this.papa.parse(data, { header: true }).data;
        const dataArray = new Array<AdditionalInformationData>();

        blob.forEach((simpleData) => {
          const additionalData: AdditionalInformationData = {
            ageGenderGroup: simpleData.DemoGpN,
            zincLevelOne: simpleData.ZnAdj_gdL,
          };

          dataArray.push(additionalData);
          // console.debug(additionalData.zincLevelOne);
        });

        this.data = dataArray;
      });
  }
}
export interface AdditionalInformationDialogData {
  data: any;
  selectedTab: number;
}

export interface AdditionalInformationData {
  // demoGP: string;
  ageGenderGroup: string;
  // areaName: string;
  zincLevelOne: string;
  // zincLevelTwo: string;
  // zincLevelThree: string;
}
