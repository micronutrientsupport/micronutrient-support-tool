import { MatTableDataSource } from '@angular/material/table';
import { Component, AfterViewInit, ViewChild, Input, Inject, Optional, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { CardComponent } from 'src/app/components/card/card.component';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { ChangeDetectorRef } from '@angular/core';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, lastValueFrom, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { QuickMapsService } from '../../../quickMaps.service';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { AgeGenderDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/ageGenderDictionaryItem';
import { Biomarker } from 'src/app/apiAndObjects/objects/biomaker';
import { TotalStats } from 'src/app/apiAndObjects/objects/biomarker/totalStats';
import { BinnedValues } from 'src/app/apiAndObjects/objects/biomarker/binnedValues';

@Component({
  selector: 'app-biomarker-info',
  templateUrl: './biomarkerInfo.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './biomarkerInfo.component.scss'],
})
export class BiomarkerInfoComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild('histo') public c1!: ElementRef<HTMLCanvasElement>;
  @Input() card: CardComponent;
  static additionalData: unknown;
  public chartData: Chart;
  public chartPNG: string;
  public chartPDF: string;
  public title = 'Additional Information';
  public selectedTab: number;

  public defThreshold = 70;
  public abnThreshold = 150;

  public binnedValues: BinnedValues;
  public labels: Array<number>;
  public binData: Array<number>;
  public totalStats: Array<TotalStats>;
  public displayedColumns = [
    'NaS',
    'lowerOutlier',
    'lowerQuartile',
    'maximum',
    'mean',
    'median',
    'minimum',
    'n',
    'standardDeviation',
    'upperOutlier',
    'upperQuartile',
  ];

  public dataSource: MatTableDataSource<TotalStats>;
  public selectedNutrient = '';
  public selectedAgeGenderGroup = '';

  public activeBiomarker: Biomarker;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();
  private counter = 0;

  constructor(
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private papa: Papa,
    public quickMapsService: QuickMapsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<AdditionalInformationDialogData>,
  ) {}

  ngAfterViewInit(): void {
    this.card.title = this.title;
    this.card.showExpand = true;
    this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

    this.subscriptions.push(
      this.card.onExpandClickObs.subscribe(() => this.openDialog()),
      this.card.onInfoClickObs.subscribe(() => this.navigateToInfoTab()),
      this.quickMapsService.micronutrient.obs.subscribe((micronutrient: MicronutrientDictionaryItem) => {
        this.selectedNutrient = micronutrient.name;
      }),
      this.quickMapsService.ageGenderGroup.obs.subscribe((ageGenderGroup: AgeGenderDictionaryItem) => {
        this.selectedAgeGenderGroup = ageGenderGroup.name;
      }),
      this.quickMapsService.biomarkerParameterChangedObs.subscribe(() => {
        // this.createBins();
        // Perhaps this can be used to trigger messgage to show tell user to refresh model
        this.init();
      }),
      this.quickMapsService.biomarkerDataObs.subscribe((data: Biomarker) => {
        if (data) {
          this.totalStats = data.totalStats;
          this.binnedValues = data.binnedValues;
          this.createBins();
        }
        this.dataSource = new MatTableDataSource(this.totalStats);
        console.debug('data in info', data);
      }),
    );
  }

  ngOnDestroy(): void {
    if (this.chartData) {
      this.chartData.destroy();
    }
  }

  public navigateToInfoTab(): void {
    this.selectedTab = 4;
    this.cdr.detectChanges();
  }

  public createBins(): void {
    // Set bins
    const arr = this.binnedValues.binData;
    if (null != arr) {
      const bins = new Array<BinObject>();
      let binCount = 0;
      const interval = Number(this.binnedValues.binSize);
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

    // void lastValueFrom(this.http.get('./assets/dummyData/FakeBiomarkerDataForDev.csv', { responseType: 'text' }))
    //   .then((data: string) => {
    //     const blob = this.papa.parse(data, { header: true }).data;
    //     const dataArray = new Array<AdditionalInformationData>();

    //     blob.forEach((simpleData) => {
    //       const additionalData: AdditionalInformationData = {
    //         ageGenderGroup: simpleData.DemoGpN,
    //         zincLevelOne: simpleData.ZnAdj_gdL,
    //       };
    //       dataArray.push(additionalData);
    //     });

    //     const filteredArray = dataArray
    //       .filter((item: AdditionalInformationData) => {
    //         if (ageGenderGroupName) {
    //           return item.ageGenderGroup === ageGenderGroupName;
    //         } else {
    //           return item;
    //         }
    //       })
    //       .map((item: AdditionalInformationData) => Number(item.zincLevelOne))
    //       .filter((value: number) => value != null) // removes any null values
    //       .filter((value: number) => !isNaN(value)); // removes any NaN values

    //     // this.mineralData = filteredArray;
    //     this.createBins(); // set interval
    //     this.cdr.detectChanges();
    //   })
    //   .finally(() => {
    //     this.cdr.detectChanges();
    //     this.loadingSrc.next(false);
    //   })
    //   .catch((e) => {
    //     this.errorSrc.next(true);
    //     throw e;
    //   });
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 0) {
      // this.biomarkerMap.invalidateSize();
    }
  }

  private setChart() {
    this.counter++;
    if (this.counter === 1) {
      const ctx = this.c1.nativeElement.getContext('2d');
      const generatedChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [
            {
              label: `${this.selectedNutrient}`,
              backgroundColor: () => 'rgba(0,220,255,0.5)',
              borderColor: 'rgba(0,220,255,0.5)',
              // outlierColor: 'rgba(0,0,0,0.5)',
              // outlierRadius: 4,
              data: this.binData,
            },
          ],
        },
        options: {
          devicePixelRatio: 2,
          scales: {
            x: {
              title: {
                display: true,
                text: `Concentration of ${this.selectedNutrient} in microg/DI`,
              },
            },
            y: {
              title: {
                display: true,
                text: `Number of ${this.selectedAgeGenderGroup}`,
              },
            },
          },
          plugins: {
            title: {
              display: false,
              text: this.title,
            },
            annotation: {
              annotations: [
                {
                  type: 'line',
                  // mode: 'vertical',
                  scaleID: 'x-axis-0',
                  value: this.defThreshold,
                  borderWidth: 2.0,
                  borderColor: 'rgba(255,0,0,0.5)',
                  label: {
                    // enabled: true,
                    content: 'Deficiency threshold',
                    backgroundColor: 'rgba(255,0,0,0.8)',
                  },
                },
                {
                  type: 'line',
                  id: 'abnLine',
                  // mode: 'vertical',
                  scaleID: 'x-axis-0',
                  value: this.abnThreshold,
                  borderWidth: 2.0,
                  borderColor: 'rgba(0,0,255,0.5)',
                  label: {
                    // enabled: true,
                    content: 'Threshold for abnormal values',
                    backgroundColor: 'rgba(0,0,255,0.8)',
                  },
                },
              ],
            },
          },
        },
      });
      this.chartData = generatedChart;
    }
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<AdditionalInformationDialogData>(BiomarkerInfoComponent, {
      data: null,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }
}

export interface AdditionalInformationDialogData {
  data: unknown;
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
