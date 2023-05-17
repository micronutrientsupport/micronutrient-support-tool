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

  public title = 'Household apparent micronutrient intake at national scale - histogram';
  public selectedTab: number;

  public chartData: ChartJSObject;
  public chartPNG: string;
  public chartPDF: string;
  public displayedColumns = ['rangeMax', 'frequency'];
  public dataSource = new MatTableDataSource<DataFrequency>();

  public csvDownloadData = new Array<DataFrequency>();

  private data: SummarizedData;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  constructor(
    private dietDataService: DietDataService,
    public quickMapsService: QuickMapsService,
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
          const country = this.quickMapsService.country.get();
          const micronutrient = this.quickMapsService.micronutrient.get();
          const FoodSystemsDataSource = this.quickMapsService.FoodSystemsDataSource.get();
          this.title = 'Apparent intake of ' + micronutrient?.name + ' in ' + country?.name + ' by household';
          this.card.title = this.title;
          //  only if all set
          if (null != country && null != micronutrient && null != FoodSystemsDataSource) {
            this.init(
              this.dietDataService
                .getHouseholdSummaries(country, micronutrient, FoodSystemsDataSource)
                .then((data) => this.householdSummariesToSummarizedData(data)),
            );
          }
        }),
      );
    } else if (null != this.dialogData) {
      // if displayed within a dialog use the data passed in
      this.init(Promise.resolve(this.dialogData.dataIn.data));
      this.title = this.dialogData.dataIn.title;
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
    console.log(data);
    const stepSize = 25;
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

        // const thresholdValue = Math.ceil(householdSummary.deficientValue / stepSize) * stepSize;
        // if (!overviewMap.has(thresholdValue)) {
        //   overviewMap.set(thresholdValue, 0);
        // }
        // overviewMap.set(thresholdValue, overviewMap.get(thresholdValue) + 1);
      });

      // iterate through from min value to max in steps of x
      const dataArray = new Array<DataFrequency>();
      for (let i = Math.min(...overviewMap.keys()); i <= Math.max(...overviewMap.keys()); i = i + stepSize) {
        if (
          data[0].deficientValue > 0 &&
          (0 === i ? 0 : i - stepSize) < data[0].deficientValue &&
          i > data[0].deficientValue
        ) {
          dataArray.push({
            rangeMin: data[0].deficientValue,
            rangeMax: data[0].deficientValue,
            frequency: 0,
          });
        }
        dataArray.push({
          rangeMin: 0 === i ? 0 : i - stepSize,
          rangeMax: i,
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

  private orderOfMagnitude(n): number {
    const order = Math.floor(Math.log(n) / Math.LN10 + 0.000000001); // because float math sucks like that
    return Math.pow(10, order);
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
    const micronutrient = this.quickMapsService.micronutrient.get();
    const generatedChart: ChartJSObject = {
      plugins: [
        ChartAnnotation,
        {
          beforeDraw: (chart) => {
            const ctx = chart.chart.ctx;
            const xAxis = chart.scales['x-axis-0'];
            const yAxis = chart.scales['y-axis-0'];
            ctx.save();
            //ctx.ticks.forEach((tick) => console.log(tick));
            console.log(chart.data.ticks);
            chart.data.labels.forEach((l) => {
              if (data.threshold > 0 && l === data.threshold) {
                const x = xAxis.getPixelForValue(l);
                ctx.textAlign = 'right';
                ctx.font = 'bold 14px';
                ctx.fillStyle = 'black';

                ctx.beginPath(); // Start a new path
                ctx.strokeStyle = 'black';
                ctx.moveTo(x, yAxis.bottom); // Move the pen to (30, 50)
                ctx.lineTo(x - 10, yAxis.bottom + 25); // Draw a line to (150, 100)
                ctx.stroke(); // Render the path

                ctx.translate(x - 8, yAxis.bottom + 30);

                // rotate 270 degrees
                ctx.rotate((31 * Math.PI) / 18); //310deg
                ctx.fillText('' + data.threshold, 0, 0);
              }
            });
            ctx.restore();
          },
        },
      ],
      type: 'bar',
      data: {
        labels: data.data.map((item) => item.rangeMax),
        datasets: [
          {
            label: 'Frequency',
            data: data.data.map((item) => item.frequency),
            borderColor: '#ff6384',
            backgroundColor: () => '#ff6384',
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
                labelString: `${micronutrient?.name} in ${micronutrient?.unit}/AFE/day`,
              },
              ticks: {
                stepSize: 25, //this.orderOfMagnitude(data.data[data.data.length - 1].rangeMax) / 20,
                // Don't write label for threshold value as it is drawn by custom plugin code
                callback: function (value) {
                  const orderOfMagnitude = (n) => {
                    const order = Math.floor(Math.log(n) / Math.LN10 + 0.000000001); // because float math sucks like that
                    return Math.pow(10, order);
                  };
                  console.log(data.data[0].rangeMin, data.data[data.data.length - 1].rangeMax);
                  console.log(orderOfMagnitude(data.data[data.data.length - 1].rangeMax));
                  console.log(orderOfMagnitude(data.data[data.data.length - 1].rangeMax) / 2);
                  if (value === data.threshold) {
                    return '';
                  }
                  return '' + value;
                },
              },
              display: true,
              id: 'x-axis-0',
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Number of households',
              },
              display: true,
              id: 'y-axis-0',
            },
          ],
        },
        annotation: {
          annotations: [],
        },
      },
    };

    if (data.threshold && data.threshold > 0) {
      // Limit max value to 5x threshold value
      generatedChart.options.scales.xAxes[0].ticks.max = data.threshold * 5;

      // Add annotation line for threshold
      generatedChart.options.annotation.annotations.push({
        type: 'line',
        mode: 'vertical',
        scaleID: 'x-axis-0',
        value: data.threshold, // data-value at which the line is drawn
        borderWidth: 2.5,
        borderColor: 'black',
        label: {
          enabled: true,
          content: 'Threshold for inadequacy',
        },
      });
    }

    this.chartData = generatedChart;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const chartForRender: ChartJSObject = JSON.parse(JSON.stringify(generatedChart));
    this.chartPNG = this.qcService.getChartAsImageUrl(chartForRender, 'png');
    this.chartPDF = this.qcService.getChartAsImageUrl(chartForRender, 'pdf');
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<HouseholdSupplyDialogData>(HouseholdSupplyComponent, {
      title: this.title,
      data: this.data,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }
}

interface DataFrequency {
  rangeMin: number;
  rangeMax: number;
  frequency: number;
}

interface SummarizedData {
  data: Array<DataFrequency>;
  threshold: number;
}

export interface HouseholdSupplyDialogData {
  title: string;
  data: SummarizedData;
  selectedTab: number;
}
