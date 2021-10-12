import {
  Component,
  ViewChild,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  Inject,
  Optional,
  AfterViewInit,
} from '@angular/core';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { QuickMapsService } from '../../../quickMaps.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CardComponent } from 'src/app/components/card/card.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { MatTabGroup } from '@angular/material/tabs';
import { QuickchartService } from 'src/app/services/quickChart.service';
import { DietDataService } from 'src/app/services/dietData.service';
import { DietaryHouseholdSummary } from 'src/app/apiAndObjects/objects/dietaryHouseholdSummary';

@Component({
  selector: 'app-household-supply',
  templateUrl: './householdSupply.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './householdSupply.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HouseholdSupplyComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort: MatSort;

  @Input() card: CardComponent;

  public title = 'National overview';
  public selectedTab: number;

  public chartData: ChartJSObject;
  public chartPNG: string;
  public chartPDF: string;
  public displayedColumns = ['value', 'frequency'];
  public dataSource = new MatTableDataSource<DataFrequency>();

  public csvDownloadData = new Array<DataFrequency>();

  private data: SummarizedData;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  constructor(
    private dietDataService: DietDataService,
    private quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private qcService: QuickchartService,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<HouseholdSupplyDialogData>,
  ) {}

  ngAfterViewInit(): void {
    if (null != this.card) {
      // if displayed within a card component init interactions with the card
      this.card.title = this.title;
      this.card.showExpand = true;
      this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

      this.subscriptions.push(this.card.onExpandClickObs.subscribe(() => this.openDialog()));
      this.subscriptions.push(this.card.onInfoClickObs.subscribe(() => this.navigateToInfoTab()));

      // respond to parameter updates
      this.subscriptions.push(
        this.quickMapsService.dietParameterChangedObs.subscribe(() => {
          this.init(
            this.dietDataService
              .getHouseholdSummaries(
                this.quickMapsService.country,
                this.quickMapsService.micronutrient,
                this.quickMapsService.dietDataSource,
              )
              .then((data) => this.householdSummariesToSummarizedData(data)),
          );
        }),
      );
    } else if (null != this.dialogData) {
      // if displayed within a dialog use the data passed in
      this.init(Promise.resolve(this.dialogData.dataIn.data));
      this.tabGroup.selectedIndex = this.dialogData.dataIn.selectedTab;
      this.cdr.detectChanges();
    }
  }

  public navigateToInfoTab(): void {
    this.selectedTab = 3;
    this.cdr.detectChanges();
  }

  private householdSummariesToSummarizedData(data: Array<DietaryHouseholdSummary>): null | SummarizedData {
    // should this stepSize be worked out from the data to ensure only a fixed/max number of table rows/bars on the chart?
    const stepSize = 50;
    let summarizedData: SummarizedData = null;

    if (data.length > 0) {
      const overviewMap = new Map<number, number>();

      data.forEach((householdSummary: DietaryHouseholdSummary) => {
        // round UP to nearest x
        const roundedValue = Math.ceil(householdSummary.dietarySupply / stepSize) * stepSize;
        if (!overviewMap.has(roundedValue)) {
          overviewMap.set(roundedValue, 0);
        }
        overviewMap.set(roundedValue, overviewMap.get(roundedValue) + 1);
      });

      // iterate through from min value to max in steps of x
      const dataArray = new Array<DataFrequency>();
      for (let i = Math.min(...overviewMap.keys()); i <= Math.max(...overviewMap.keys()); i = i + stepSize) {
        dataArray.push({
          value: i,
          frequency: overviewMap.get(i) ?? 0, // fill in any missing frequencies with zero
        });
      }

      summarizedData = {
        data: dataArray,
        threshold: data[0].deficientValue,
      };
    }
    return summarizedData;
  }

  private init(dataPromise: Promise<SummarizedData>): void {
    this.loadingSrc.next(true);
    dataPromise
      .then((data: SummarizedData) => {
        this.data = data;
        if (null == data) {
          throw new Error('data error');
        }
        this.dataSource.data = data.data;
        // console.debug('data:', this.dataSource.data);
        this.errorSrc.next(false);
        this.chartData = null;
        // force change detection to:
        // remove chart before re-setting it to stop js error
        // show table and init paginator and sorter
        this.cdr.detectChanges();

        this.dataSource.sort = this.sort;

        this.initialiseGraph(data);
        this.csvDownloadData = data.data;
      })
      .finally(() => {
        this.loadingSrc.next(false);
        this.cdr.detectChanges();
      })
      .catch((e) => {
        this.errorSrc.next(true);
        throw e;
      });
  }

  private initialiseGraph(data: SummarizedData): void {
    const generatedChart: ChartJSObject = {
      plugins: [ChartAnnotation],
      type: 'bar',
      data: {
        labels: data.data.map((item) => item.value),
        datasets: [
          {
            label: 'Frequency',
            data: data.data.map((item) => item.frequency),
            borderColor: '#ff6384',
            backgroundColor: '#ff6384',
            fill: true,
          },
        ],
      },
      options: {
        title: {
          display: false,
          text: this.title,
        },
        maintainAspectRatio: false,
        legend: {
          display: false,
        },

        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: `${this.quickMapsService.micronutrient.name} in ${this.quickMapsService.micronutrient.unit}/capita/day`,
              },
              display: true,
              id: 'x-axis-0',
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Count',
              },

              display: true,
              id: 'y-axis-0',
            },
          ],
        },
        annotation: {
          annotations: [
            {
              type: 'line',
              id: 'vLine',
              mode: 'vertical',
              scaleID: 'x-axis-0',
              value: data.threshold, // data-value at which the line is drawn
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

    this.chartData = generatedChart;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const chartForRender: ChartJSObject = JSON.parse(JSON.stringify(generatedChart));
    this.chartPNG = this.qcService.getChartAsImageUrl(chartForRender, 'png');
    this.chartPDF = this.qcService.getChartAsImageUrl(chartForRender, 'pdf');
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<HouseholdSupplyDialogData>(HouseholdSupplyComponent, {
      data: this.data,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }
}

interface DataFrequency {
  value: number;
  frequency: number;
}

interface SummarizedData {
  data: Array<DataFrequency>;
  threshold: number;
}

export interface HouseholdSupplyDialogData {
  data: SummarizedData;
  selectedTab: number;
}
