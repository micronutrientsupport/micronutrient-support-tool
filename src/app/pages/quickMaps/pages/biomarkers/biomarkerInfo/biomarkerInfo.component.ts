/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Component, AfterViewInit, ViewChild, ElementRef, Input, Inject, Optional } from '@angular/core';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
// import * as ChartAnnotation from 'chartjs-plugin-annotation';
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
  @ViewChild('map1') map1Element: ElementRef;

  @Input() card: CardComponent;

  public chartData: ChartJSObject;
  public title = 'Additional Information';

  // public displayedColumns = ['a', 'b', 'c', 'd'];
  // public displayedColumns2 = ['a', 'b', 'c'];

  // public defThreshold = 20;
  // public abnThreshold = 60;
  // public showOutliers = false;
  // public outlierControl = new FormControl(false);
  // public tables = new FormControl();
  // public tableList: string[] = ['Deficiency', 'Excess', 'Combined deficiency and excess', 'Continuous Data'];
  // private biomarkerMap: L.Map;
  public data: Array<AdditionalInformationData>;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  constructor(
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private papa: Papa,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<AdditionalInformationDialogData>,
  ) {}
  ngAfterViewInit(): void {
    this.getDataFromCSV();
    this.card.title = this.title;
    this.card.showExpand = true;
    this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

    this.subscriptions.push(this.card.onExpandClickObs.subscribe(() => this.openDialog()));

    // this.chartData = {
    //   plugins: [ChartAnnotation],
    //   type: 'boxplot',
    //   data: {
    //     // define label tree
    //     labels: ['Central', 'North', 'South', 'South East', 'West'],
    //     datasets: [
    //       {
    //         label: 'Zinc',
    //         backgroundColor: 'rgba(0,220,255,0.5)',
    //         borderColor: 'rgba(0,220,255,0.5)',
    //         outlierColor: 'rgba(0,0,0,0.5)',
    //         outlierRadius: 4,
    //         data: [
    //           [40, 50, 60, 70, 80],
    //           [0, 10, 20, 30, 40],
    //           [20, 30, 40, 50, 60],
    //           [60, 70, 80, 90, 100],
    //           [20, 40, 60, 80, 100],
    //         ],
    //       },
    //     ],
    //   },
    //   options: {
    //     annotation: {
    //       annotations: [
    //         {
    //           type: 'line',
    //           id: 'defLine',
    //           mode: 'horizontal',
    //           scaleID: 'y-axis-0',
    //           value: this.defThreshold,
    //           borderWidth: 2.0,
    //           borderColor: 'rgba(255,0,0,0.5)',
    //           label: {
    //             enabled: true,
    //             content: 'Deficiency threshold',
    //             backgroundColor: 'rgba(255,0,0,0.8)',
    //           },
    //         },
    //         {
    //           type: 'line',
    //           id: 'abnLine',
    //           mode: 'horizontal',
    //           scaleID: 'y-axis-0',
    //           value: this.abnThreshold,
    //           borderWidth: 2.0,
    //           borderColor: 'rgba(0,0,255,0.5)',
    //           label: {
    //             enabled: true,
    //             content: 'Threshold for abnormal values',
    //             backgroundColor: 'rgba(0,0,255,0.8)',
    //           },
    //         },
    //       ],
    //     },
    //   },
    // };
  }

  // public toggleShowOutlier(): void {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   this.showOutliers = this.outlierControl.value;
  // }

  // public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
  //   if (tabChangeEvent.index === 0) {
  //     this.biomarkerMap.invalidateSize();
  //   }
  // }

  public getDataFromCSV(): void {
    // const exportObjectArray = new Array<AdditionalInformationData>();
    // exportObjectArray.push({
    //   clientSampleLabID: 'Lab Sample ID',
    //   labComment: 'Lab Comment',
    //   splitType: 'Split Type',
    //   location: 'Location',
    //   label: 'Label'
    // });

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
        });
        this.data = dataArray;
      });
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<AdditionalInformationDialogData>(BiomarkerInfoComponent, {
      data: null,
      selectedTab: this.tabGroup.selectedIndex,
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
