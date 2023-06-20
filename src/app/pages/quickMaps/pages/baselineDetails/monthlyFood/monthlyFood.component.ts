import {
  ChangeDetectorRef,
  ViewChild,
  ChangeDetectionStrategy,
  Component,
  Input,
  Optional,
  Inject,
  AfterViewInit,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChartJSObject, ChartsJSDataObject, CreateShortUrl } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { MonthlyFoodGroup } from 'src/app/apiAndObjects/objects/monthlyFoodGroup';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { QuickMapsService } from '../../../quickMaps.service';
import { CardComponent } from 'src/app/components/card/card.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { MatTabGroup } from '@angular/material/tabs';
import { NotificationsService } from 'src/app/components/notifications/notification.service';
import { QuickchartService } from 'src/app/services/quickChart.service';
import { DietDataService } from 'src/app/services/dietData.service';
import ColorHash from 'color-hash-ts';

@Component({
  selector: 'app-monthly-food',
  templateUrl: './monthlyFood.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './monthlyFood.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyFoodComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort: MatSort;
  @Input() card: CardComponent;
  public title = 'Monthly apparent micronutrient intake';
  public selectedTab: number;
  public dataSource: MatTableDataSource<MonthlyFoodGroup>;
  public chartDataStack: ChartJSObject;
  public chartDataLine: ChartJSObject;
  public chartPNG: string;
  public chartPDF: string;
  public displayedColumns = [];
  private data: Array<MonthlyFoodGroup>;
  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);
  private subscriptions = new Array<Subscription>();

  constructor(
    private notificationService: NotificationsService,
    private dietDataService: DietDataService,
    public quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private qcService: QuickchartService,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<MonthlyFoodDialogData>,
  ) {}

  ngAfterViewInit(): void {
    // if displayed within a card component init interactions with the card
    if (null != this.card) {
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
          this.title =
            'Seasonality in apparent micronutrient intake for ' + micronutrient?.name + ' in ' + country?.name;
          this.card.title = this.title;

          //  only if all set
          if (null != country && null != micronutrient && null != FoodSystemsDataSource) {
            this.init(this.dietDataService.getMonthlyFoodGroups(country, micronutrient, FoodSystemsDataSource));
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
    this.selectedTab = 4;
    this.cdr.detectChanges();
  }

  public isLikelyANumericString(str): boolean {
    return !isNaN(str);
  }

  public isNumber(val): boolean {
    return typeof val === 'number';
  }

  private init(dataPromise: Promise<Array<MonthlyFoodGroup>>): void {
    this.loadingSrc.next(true);
    dataPromise
      .then((data: Array<MonthlyFoodGroup>) => {
        this.data = data;
        if (null == data) {
          throw new Error('data error');
        }

        this.dataSource = new MatTableDataSource(data);

        const foodTypes = [...new Set(data.map((item) => item.foodGroupName))];
        const timePeriod = [...new Set(data.map((item) => item.month.name))];

        // Generate the stacked chart
        const monthlyStackedChartData = {
          labels: timePeriod,
          datasets: [],
        };

        const monthlyLineChartData = {
          labels: timePeriod,
          datasets: [],
        };

        foodTypes.forEach((thing, index) => {
          monthlyStackedChartData.datasets.push({
            label: foodTypes[index],
            data: data.filter((item) => item.foodGroupName === foodTypes[index]).map((item) => item.percentageConsumed),
            backgroundColor: this.genColorHex(foodTypes[index]),
          });
          monthlyLineChartData.datasets.push({
            label: foodTypes[index],
            data: data.filter((item) => item.foodGroupName === foodTypes[index]).map((item) => item.percentageConsumed),
            backgroundColor: this.genColorHex(foodTypes[index]),
          });
        });

        // Generate the table
        this.displayedColumns = foodTypes;
        this.displayedColumns.unshift('Month');
        const newTableData = [];
        const months = [...new Set(data.map((item) => item.month.name))];
        months.forEach((t, i) => {
          const content = {};
          foodTypes.forEach((thing, index) => {
            content[foodTypes[index]] = data
              .filter((item) => item.foodGroupName === foodTypes[index] && item.month.name === months[i])
              .map((item) => item.dietarySupply);
          });
          // eslint-disable-next-line @typescript-eslint/dot-notation
          content['Month'] = months[i];
          newTableData.push(content);
        });

        this.errorSrc.next(false);
        this.chartDataStack = null;
        this.chartDataLine = null;

        // force change detection to:
        // remove chart before re-setting it to stop js error
        // show table and init paginator and sorter
        this.cdr.detectChanges();
        this.initialiseTable(newTableData);
        this.initialiseStackedGraph(monthlyStackedChartData);
        this.initialiseLineGraph(monthlyLineChartData);
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

  private initialiseTable(data: Array<MonthlyFoodGroup>): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }

  private initialiseStackedGraph(monthlyChartData: ChartsJSDataObject): void {
    const generatedChart: ChartJSObject = {
      type: 'bar',
      data: monthlyChartData,
      options: {
        title: {
          display: false,
          text: this.title,
        },
        legend: {
          display: false,
          position: 'bottom',
          align: 'center',
        },
        tooltips: {
          callbacks: {
            label: (item, result) => {
              return `${result.datasets[item.datasetIndex].label}: ${item.value}%`;
            },
          },
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
              barPercentage: 0.9,
              categoryPercentage: 1.0,
              ticks: {
                min: 0,
                max: 100,
                stepSize: 10,
              },
              scaleLabel: {
                display: true,
                labelString: 'Percentage Contribution',
              },
            },
          ],
        },
      },
    };
    this.chartDataStack = generatedChart;

    this.qcService.getChartViaPost(generatedChart, 'png').subscribe((response) => {
      const chartResponse = response as CreateShortUrl;
      this.chartPNG = chartResponse.url;
    });
    this.qcService.getChartViaPost(generatedChart, 'pdf').subscribe((response) => {
      const chartResponse = response as CreateShortUrl;
      this.chartPDF = chartResponse.url;
    });
  }
  private initialiseLineGraph(monthlyChartData: ChartsJSDataObject): void {
    const generatedChart: ChartJSObject = {
      type: 'line',
      data: monthlyChartData,
      options: {
        title: {
          display: false,
          text: this.title,
        },
        legend: {
          display: false,
          position: 'bottom',
          align: 'center',
        },
        tooltips: {
          callbacks: {
            label: (item, result) => {
              return `${result.datasets[item.datasetIndex].label}: ${item.value}`;
            },
          },
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: false,
            },
          ],
          yAxes: [
            {
              stacked: true,
              barPercentage: 0.9,
              categoryPercentage: 1.0,
              ticks: {
                min: 0,
                max: 100,
                stepSize: 10,
              },
              scaleLabel: {
                display: true,
                //labelString: `National nutrient availability ${this.quickMapsService.micronutrient.get().unit}/month`,
                labelString: 'Percentage Contribution',
              },
            },
          ],
        },
      },
    };
    this.chartDataLine = generatedChart;
    this.qcService.getChartViaPost(generatedChart, 'png').subscribe((response) => {
      const chartResponse = response as CreateShortUrl;
      this.chartPNG = chartResponse.url;
    });
    this.qcService.getChartViaPost(generatedChart, 'pdf').subscribe((response) => {
      const chartResponse = response as CreateShortUrl;
      this.chartPDF = chartResponse.url;
    });
  }

  private genColorHex(foodTypeIndex: string) {
    const colorHash = new ColorHash();
    return colorHash.hex(foodTypeIndex);
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<MonthlyFoodDialogData>(MonthlyFoodComponent, {
      title: this.title,
      data: this.data,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }
}

export interface MonthlyFoodDialogData {
  title: string;
  data: Array<MonthlyFoodGroup>;
  selectedTab: number;
}
