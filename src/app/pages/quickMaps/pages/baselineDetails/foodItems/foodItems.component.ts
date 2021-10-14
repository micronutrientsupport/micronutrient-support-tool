/* eslint-disable @typescript-eslint/dot-notation */
import {
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  Component,
  ViewChild,
  Inject,
  Optional,
  AfterViewInit,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TopFoodSource } from 'src/app/apiAndObjects/objects/topFoodSource';
import { QuickMapsService } from '../../../quickMaps.service';
import 'chartjs-chart-treemap';
import ColorHash from 'color-hash-ts';
import { ChartData, ChartDataSets, ChartPoint, ChartTooltipItem } from 'chart.js';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { CardComponent } from 'src/app/components/card/card.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { MatTabGroup } from '@angular/material/tabs';
import { NotificationsService } from 'src/app/components/notifications/notification.service';
import { QuickchartService } from 'src/app/services/quickChart.service';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { DietDataService } from 'src/app/services/dietData.service';
import { DietDataSource } from 'src/app/apiAndObjects/objects/dietDataSource';
@Component({
  selector: 'app-food-items',
  templateUrl: './foodItems.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './foodItems.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodItemsComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort: MatSort;

  @Input() card: CardComponent;

  public title = 'Top 20 Food Items';
  public selectedTab: number;

  public chartData: ChartJSObject;
  public chartPNG: string;
  public chartPDF: string;
  public displayedColumns = ['ranking', 'foodGroupName', 'dailyMnContribution'];
  public dataSource: MatTableDataSource<TopFoodSource>;
  public mnUnit = '';

  private data: Array<TopFoodSource>;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  constructor(
    private notificationService: NotificationsService,
    private dietDataService: DietDataService,
    private quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private qcService: QuickchartService,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<FoodItemsDialogData>,
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
          const micronutrient = this.quickMapsService.micronutrient;
          const dietDataSource = this.quickMapsService.dietDataSource;

          //  only if all set
          if (null != micronutrient && null != dietDataSource) {
            this.init(this.dietDataService.getTopFoods(micronutrient, dietDataSource));
          }
        }),
        this.quickMapsService.micronutrientObs.subscribe((micronutrient: MicronutrientDictionaryItem) => {
          this.mnUnit = null == micronutrient ? '' : micronutrient.unit;
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

  private init(dataPromise: Promise<Array<TopFoodSource>>): void {
    this.loadingSrc.next(true);
    dataPromise
      .then((data: Array<TopFoodSource>) => {
        this.data = data;
        if (null == data) {
          // this.notificationService.sendNegative('An error occurred -', 'data could not be loaded');
          throw new Error('data error');
        }

        this.dataSource = new MatTableDataSource(data);
        this.errorSrc.next(false);
        this.chartData = null;
        // force change detection to:
        // remove chart before re-setting it to stop js error
        // show table and init paginator and sorter
        this.cdr.detectChanges();

        this.dataSource.sort = this.sort;

        this.initTreemap(data);
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

  private initTreemap(data: Array<TopFoodSource>): void {
    const generatedChart: ChartJSObject = {
      type: 'treemap',
      data: {
        datasets: [
          {
            tree: data,
            key: 'dailyMnContribution',
            groups: ['foodGroupName'],
            groupLabels: true,
            fontColor: '#ffffff',
            fontFamily: 'Quicksand',
            fontSize: 12,
            fontStyle: 'normal',
            backgroundColor: (result: ChartData) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              const groupedChartData: ChartDataSets = result['dataset']['data'];
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              const groupedChartDataAtCurrentIndex = groupedChartData[result['dataIndex']];
              let colourCode = '';
              if (groupedChartDataAtCurrentIndex) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                colourCode = this.genColorHex(groupedChartDataAtCurrentIndex['g']);
              }
              return this.genColorHex(colourCode);
            },
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
        tooltips: {
          callbacks: {
            title: () => 'Food Item',
            label: (item: ChartTooltipItem, result: ChartData) => {
              const dataset: ChartDataSets = result.datasets[item.datasetIndex];
              const dataItem: number | number[] | ChartPoint = dataset.data[item.index];
              // tslint:disable-next-line: no-string-literal
              const label: string = dataItem['g'] as string;
              // tslint:disable-next-line: no-string-literal
              const value: string = dataItem['v'] as string;
              const mnUnit = this.mnUnit;
              return `${label}: ${Number(value).toPrecision(3)} ${mnUnit}/capita/day`;
            },
          },
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
    void this.dialogService.openDialogForComponent<FoodItemsDialogData>(FoodItemsComponent, {
      data: this.data,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }

  private genColorHex(foodTypeIndex: string) {
    const colorHash = new ColorHash();
    return colorHash.hex(foodTypeIndex);
  }
}

export interface FoodItemsDialogData {
  data: Array<TopFoodSource>;
  selectedTab: number;
}
