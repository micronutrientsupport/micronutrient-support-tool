import {
  ChangeDetectorRef,
  ViewChild,
  ChangeDetectionStrategy,
  Component,
  Input,
  Optional,
  Inject,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// import { ChartJSObject, ChartsJSDataObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import {
  CategoryScale,
  Chart,
  LineController,
  LineElement,
  PointElement,
  TooltipItem,
  Tooltip,
  ChartData,
} from 'chart.js';
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
  @ViewChild('chartStackedBar') public stackedChartCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartLine') public lineChartCanvas: ElementRef<HTMLCanvasElement>;
  @Input() card: CardComponent;

  public title = 'Monthly apparent micronutrient intake';
  public selectedTab: number;
  public dataSource: MatTableDataSource<MonthlyFoodGroup>;
  public chartStackedBar: Chart;
  public chartLine: Chart;
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

  ngOnInit(): void {
    Chart.register(CategoryScale, LineController, PointElement, LineElement, Tooltip);
  }

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

  ngOnDestroy(): void {
    this.chartStackedBar.destroy();
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
        const monthlyStackedChartData: ChartData = {
          labels: timePeriod,
          datasets: [],
        };

        const monthlyLineChartData: ChartData = {
          labels: timePeriod,
          datasets: [],
        };

        foodTypes.forEach((thing, index) => {
          monthlyStackedChartData.datasets.push({
            barPercentage: 0.9,
            categoryPercentage: 1.0,
            label: foodTypes[index],
            data: data.filter((item) => item.foodGroupName === foodTypes[index]).map((item) => item.percentageConsumed),
            backgroundColor: this.genColorHex(foodTypes[index]),
          });
          monthlyLineChartData.datasets.push({
            barPercentage: 0.9,
            categoryPercentage: 1.0,
            label: foodTypes[index],
            data: data.filter((item) => item.foodGroupName === foodTypes[index]).map((item) => item.percentageConsumed),
            backgroundColor: this.genColorHex(foodTypes[index]),
            fill: true,
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

        // force change detection to:
        // remove chart before re-setting it to stop js error
        // show table and init paginator and sorter
        this.cdr.detectChanges();

        this.initialiseTable(newTableData);

        if (this.chartStackedBar) {
          this.chartStackedBar.destroy();
          this.initialiseStackedGraph(monthlyStackedChartData);
        } else {
          this.initialiseStackedGraph(monthlyStackedChartData);
        }

        if (this.chartLine) {
          this.chartLine.destroy();
          this.initialiseLineGraph(monthlyLineChartData);
        } else {
          this.initialiseLineGraph(monthlyLineChartData);
        }
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

  private initialiseStackedGraph(monthlyChartData: ChartData): void {
    const ctx = this.stackedChartCanvas.nativeElement.getContext('2d');
    const generatedChart = new Chart(ctx, {
      type: 'bar',
      data: monthlyChartData,
      options: {
        plugins: {
          title: {
            display: false,
            text: this.title,
          },
          legend: {
            display: false,
            position: 'bottom',
            align: 'center',
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem: TooltipItem<'bar'>) => {
                return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}%`;
              },
            },
          },
        },
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            min: 0,
            max: 100,
            ticks: {
              stepSize: 10,
            },
            title: {
              display: true,
              text: 'Percentage Contribution',
            },
          },
        },
      },
    });
    this.chartStackedBar = generatedChart;
    const chartForRender = JSON.parse(JSON.stringify(generatedChart.config));
    this.chartPNG = this.qcService.getChartAsImageUrl(chartForRender, 'png');
    this.chartPDF = this.qcService.getChartAsImageUrl(chartForRender, 'pdf');
  }

  private initialiseLineGraph(monthlyChartData: ChartData): void {
    const ctx = this.lineChartCanvas.nativeElement.getContext('2d');
    const generatedChart = new Chart(ctx, {
      type: 'line',
      data: monthlyChartData,
      options: {
        plugins: {
          title: {
            display: false,
            text: this.title,
          },
          legend: {
            display: false,
            position: 'bottom',
            align: 'center',
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem: TooltipItem<'line'>) => {
                return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}%`;
              },
            },
          },
        },
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            min: 0,
            max: 100,
            ticks: {
              stepSize: 10,
            },
            title: {
              display: true,
              text: 'Percentage Contribution',
            },
          },
        },
      },
    });
    this.chartLine = generatedChart;
    const chartForRender = JSON.parse(JSON.stringify(generatedChart.config));
    this.chartPNG = this.qcService.getChartAsImageUrl(chartForRender, 'png');
    this.chartPDF = this.qcService.getChartAsImageUrl(chartForRender, 'pdf');
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
