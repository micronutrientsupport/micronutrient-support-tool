/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { MatTableDataSource } from '@angular/material/table';
import { Component, AfterViewInit, ViewChild, Input, Inject, Optional } from '@angular/core';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { CardComponent } from 'src/app/components/card/card.component';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { ChangeDetectorRef } from '@angular/core';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { QuickMapsService } from '../../../quickMaps.service';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { AgeGenderGroup } from 'src/app/apiAndObjects/objects/ageGenderGroup';
import { QuickchartService } from 'src/app/services/quickChart.service';
@Component({
  selector: 'app-biomarker-info',
  templateUrl: './biomarkerInfo.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './biomarkerInfo.component.scss'],
})
export class BiomarkerInfoComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  @Input() card: CardComponent;
  static additionalData: any;
  public chartData: ChartJSObject;
  public chartPNG: string;
  public chartPDF: string;
  public title = 'Additional Information';
  public selectedTab: number;

  public defThreshold = 70;
  public abnThreshold = 150;
  public labels: Array<number>;
  public binData: Array<number>;
  public displayedColumns = ['mean', 'median', 'stdDev', 'min', 'max', 'q1', 'q3', 'n', 'nonApplicables'];

  public dataSource: MatTableDataSource<TableObject>;
  public selectedNutrient = '';
  public selectedAgeGenderGroup = '';
  public mineralData: Array<number>;
  public selectedBinSize = '25';

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  constructor(
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private papa: Papa,
    public quickMapsService: QuickMapsService,
    private qcService: QuickchartService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<AdditionalInformationDialogData>,
  ) {}
  ngAfterViewInit(): void {
    this.card.title = this.title;
    this.card.showExpand = true;
    this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

    this.subscriptions.push(this.card.onExpandClickObs.subscribe(() => this.openDialog()));
    this.subscriptions.push(this.card.onInfoClickObs.subscribe(() => this.navigateToInfoTab()));

    this.subscriptions.push(
      this.quickMapsService.micronutrientObs.subscribe((micronutrient: MicronutrientDictionaryItem) => {
        this.selectedNutrient = micronutrient.name;
      }),
    );

    this.subscriptions.push(
      this.quickMapsService.ageGenderObs.subscribe((ageGenderGroup: AgeGenderGroup) => {
        this.selectedAgeGenderGroup = ageGenderGroup.name;
      }),
    );

    this.subscriptions.push(
      this.quickMapsService.parameterChangedObs.subscribe(() => {
        this.createBins();
        this.init();
      }),
    );
  }

  public navigateToInfoTab(): void {
    this.selectedTab = 4;
    this.cdr.detectChanges();
  }

  public createBins(): void {
    // Set bins
    const arr = this.mineralData;
    if (null != arr) {
      const bins = new Array<BinObject>();
      let binCount = 0;
      const interval = Number(this.selectedBinSize);
      const numOfBuckets = Math.max(...arr);

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
      arr.forEach((value: number) => {
        bins.forEach((bin: BinObject) => {
          if (value > bin.minNum && value <= bin.maxNum) {
            bin.count++;
          }
        });
      });

      this.binData = bins.map((item: BinObject) => item.count);
      this.labels = bins.map((item: BinObject) => item.maxNum);

      this.setChart();
    }
  }
  private init(): void {
    this.loadingSrc.next(true);
    let ageGenderGroupName = '';

    switch (this.selectedAgeGenderGroup) {
      case 'Adult Women':
        ageGenderGroupName = 'WRA';
        break;
      case 'Adult Men':
        ageGenderGroupName = 'Men';
        break;
      case 'Children':
        ageGenderGroupName = 'PSC';
        break;
      default: {
        ageGenderGroupName = null;
        break;
      }
    }

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

        const filteredArray = dataArray
          .filter((item: AdditionalInformationData) => {
            if (ageGenderGroupName) {
              return item.ageGenderGroup === ageGenderGroupName;
            } else {
              return item;
            }
          })
          .map((item: AdditionalInformationData) => Number(item.zincLevelOne))
          .filter((value: number) => value != null) // removes any null values
          .filter((value: number) => !isNaN(value)); // removes any NaN values

        this.mineralData = filteredArray;
        this.generateTable();
        this.createBins(); // set interval
        this.cdr.detectChanges();
      })
      .finally(() => {
        this.cdr.detectChanges();
        this.loadingSrc.next(false);
      });
  }

  private generateTable() {
    const sortedArray = this.mineralData.sort((a, b) => a - b);
    const n = sortedArray.length;
    const mean = sortedArray.reduce((acc, val) => acc + val, 0) / n;
    const median = (sortedArray[Math.floor((n - 1) / 2)] + sortedArray[Math.ceil((sortedArray.length - 1) / 2)]) / 2;
    const standardDeviation = Math.sqrt(
      sortedArray
        .reduce((acc: Array<number>, val: number) => acc.concat((val - mean) ** 2), [])
        .reduce((acc, val) => acc + val, 0) /
        (n - 1),
    );
    const min = Math.min(...sortedArray);
    const max = Math.max(...sortedArray);
    const q1 = this.calcQuartile(sortedArray, 1);
    const q3 = this.calcQuartile(sortedArray, 3);
    const nonApplicables = this.mineralData.length - sortedArray.length;

    const tableObject: TableObject = {
      mean: mean,
      median: median,
      stdDev: standardDeviation,
      min: min,
      max: max,
      q1: q1,
      q3: q3,
      n: n,
      nonApplicables: nonApplicables, // TODO: confirm is guff data frequency;
    };

    const dataArray = new Array<TableObject>();
    dataArray.push(tableObject);
    this.dataSource = new MatTableDataSource(dataArray);
  }

  private calcQuartile(arr, q): number {
    // Turn q into a decimal (e.g. 95 becomes 0.95)
    q = q / 100;

    // Sort the array into ascending order

    // Work out the position in the array of the percentile point
    const p = (arr.length - 1) * q;
    const b = Math.floor(p);

    // Work out what we rounded off (if anything)
    const remainder = p - b;

    // See whether that data exists directly
    if (arr[b + 1] !== undefined) {
      return parseFloat(arr[b]) + remainder * (parseFloat(arr[b + 1]) - parseFloat(arr[b]));
    } else {
      return parseFloat(arr[b]);
    }
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 0) {
      // this.biomarkerMap.invalidateSize();
    }
  }
  private setChart() {
    const generatedChart: ChartJSObject = {
      // this.chartData = {
      plugins: [ChartAnnotation],
      type: 'bar',
      data: {
        labels: this.labels,

        datasets: [
          {
            label: `${this.selectedNutrient}`,
            backgroundColor: 'rgba(0,220,255,0.5)',
            borderColor: 'rgba(0,220,255,0.5)',
            outlierColor: 'rgba(0,0,0,0.5)',
            outlierRadius: 4,
            data: this.binData,
          },
        ],
      },
      options: {
        title: {
          display: false,
          text: this.title,
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: `Concentration of ${this.selectedNutrient} in microg/DI`,
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: `Number of ${this.selectedAgeGenderGroup}`,
              },
            },
          ],
        },
        annotation: {
          annotations: [
            {
              type: 'line',
              id: 'defLine',
              mode: 'vertical',
              scaleID: 'x-axis-0',
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
              scaleID: 'x-axis-0',
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
    this.chartData = generatedChart;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const chartForRender: ChartJSObject = JSON.parse(JSON.stringify(generatedChart));
    console.log(this.chartPNG);
    this.chartPNG = this.qcService.getChartAsImageUrl(chartForRender, 'png');
    this.chartPDF = this.qcService.getChartAsImageUrl(chartForRender, 'pdf');
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
  ageGenderGroup: string;
  zincLevelOne: string;
}

interface TableObject {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  n: number;
  nonApplicables: number;
}

interface BinObject {
  binNum: number;
  minNum: number;
  maxNum: number;
  count: number;
}
