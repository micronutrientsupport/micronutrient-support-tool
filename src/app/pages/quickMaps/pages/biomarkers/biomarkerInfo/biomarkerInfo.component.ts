import { MatTableDataSource } from '@angular/material/table';
import { Component, AfterViewInit, ViewChild, Input, Inject, Optional, ElementRef, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { CardComponent } from 'src/app/components/card/card.component';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { ChangeDetectorRef } from '@angular/core';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { QuickMapsService } from '../../../quickMaps.service';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { AgeGenderDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/ageGenderDictionaryItem';
import { Biomarker } from 'src/app/apiAndObjects/objects/biomarker';
import { AggregatedStats } from 'src/app/apiAndObjects/objects/biomarker/aggregatedStat';
import { AggregatedOutliers } from 'src/app/apiAndObjects/objects/biomarker/aggregatedOutliers';
import { TotalStats } from 'src/app/apiAndObjects/objects/biomarker/totalStats';

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
  public labels: Array<number>;
  public bmAggStats: Array<AggregatedStats>;
  public bmAggOutliers: Array<AggregatedOutliers>;
  public bmTotalStats: Array<TotalStats>;
  public displayedColumns = ['nonApplicables', 'max', 'mean', 'median', 'min', 'n', 'stdDev', 'q1', 'q3'];

  public dataSource: MatTableDataSource<TableObject>;
  public selectedNutrient = '';
  public selectedAgeGenderGroup = '';
  public mineralData: Array<number>;
  public selectedBinSize = '25';
  public binData: Array<number>;
  public activeBiomarker: Biomarker;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);
  public biomarkerDataUpdating = false;

  private subscriptions = new Array<Subscription>();

  constructor(
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
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

      this.quickMapsService.biomarkerDataObs.subscribe((data: Biomarker) => {
        if (data) {
          this.loadingSrc.next(true);
          this.activeBiomarker = data;

          this.binData = this.activeBiomarker.binnedValues.binData;
          this.bmAggStats = this.activeBiomarker.aggregatedStats;
          this.bmAggOutliers = this.activeBiomarker.aggregatedOutliers;
          this.bmTotalStats = this.activeBiomarker.totalStats;
          this.labels = this.activeBiomarker.binnedValues.binLabel;

          this.setChart();
          this.generateTable();
        }
      }),
    );

    this.quickMapsService.biomarkerDataUpdatingSrc.obs.subscribe((updating: boolean) => {
      this.biomarkerDataUpdating = updating;
      if (updating) {
        this.loadingSrc.next(true);
      }
    });
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

  private generateTable() {
    const tableObject: TableObject = {
      mean: this.bmTotalStats[0].mean,
      median: this.bmTotalStats[0].median,
      stdDev: this.bmTotalStats[0].standardDeviation,
      min: this.bmTotalStats[0].minimum,
      max: this.bmTotalStats[0].maximum,
      q1: this.bmTotalStats[0].lowerQuartile,
      q3: this.bmTotalStats[0].upperQuartile,
      n: this.bmTotalStats[0].n,
      nonApplicables: this.bmTotalStats[0].NaS,
    };

    const dataArray = new Array<TableObject>();
    dataArray.push(tableObject);
    this.dataSource = new MatTableDataSource(dataArray);

    this.cdr.detectChanges();
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 0) {
      // this.biomarkerMap.invalidateSize();
    }
  }

  private setChart() {
    if (this.chartData) {
      this.chartData.destroy();
    }

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
    this.loadingSrc.next(false);
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
