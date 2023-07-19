import {
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  Component,
  ViewChild,
  Inject,
  Optional,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TopFoodSource } from 'src/app/apiAndObjects/objects/topFoodSource';
import { QuickMapsService } from '../../../quickMaps.service';
import 'chartjs-chart-treemap';
import ColorHash from 'color-hash-ts';
import { Chart, LinearScale } from 'chart.js';
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
import { DataLevel } from 'src/app/apiAndObjects/objects/enums/dataLevel.enum';
import { TitleCasePipe } from '@angular/common';

import { TreemapController, TreemapElement } from 'chartjs-chart-treemap';

// Uitlity type
type Mutable<Type> = {
  -readonly [Key in keyof Type]: Type[Key];
};

@Component({
  selector: 'app-food-items',
  templateUrl: './foodItems.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './foodItems.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodItemsComponent implements AfterViewInit {
  @ViewChild('chartDataGenus') public c1!: ElementRef<HTMLCanvasElement>;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort: MatSort;

  @Input() card: CardComponent;

  public title = 'Top 20 Food Items';
  public selectedTab: number;

  public chartDataGroup: Chart;
  public chartDataGenus: Chart;

  public chartPNG: string;
  public chartPDF: string;
  public displayedColumns = ['ranking', 'foodGenusName', 'foodGroupName', 'dailyMnContribution'];
  public dataSource: MatTableDataSource<TopFoodSource>;
  public mnUnit = '';

  public readonly DATA_LEVEL = DataLevel;

  private data: Array<TopFoodSource>;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  public tmpCounter = 0;

  constructor(
    private notificationService: NotificationsService,
    private dietDataService: DietDataService,
    public quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private qcService: QuickchartService,
    private cdr: ChangeDetectorRef,
    private titlecasePipe: TitleCasePipe,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<FoodItemsDialogData>,
  ) {
    Chart.register(TreemapController, TreemapElement, LinearScale);
  }

  ngAfterViewInit(): void {
    // if displayed within a card component init interactions with the card
    if (null != this.card) {
      this.card.title = this.title;
      this.card.showExpand = true;
      this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

      this.subscriptions.push(
        this.card.onExpandClickObs.subscribe(() => this.openDialog()),
        this.card.onInfoClickObs.subscribe(() => this.navigateToInfoTab()),
        // respond to parameter updates
        this.quickMapsService.dietParameterChangedObs.subscribe(() => {
          const micronutrient = this.quickMapsService.micronutrient.get();
          const FoodSystemsDataSource = this.quickMapsService.FoodSystemsDataSource.get();
          this.title =
            'Top 20 food items contributing to apparent intake for ' +
            micronutrient?.name +
            ' in ' +
            this.quickMapsService.country.get()?.name;
          this.card.title = this.title;
          //  only if all set
          if (null != micronutrient && null != FoodSystemsDataSource) {
            this.init(this.dietDataService.getTopFoods(micronutrient, FoodSystemsDataSource));
          }
        }),
        this.quickMapsService.micronutrient.obs.subscribe((micronutrient: MicronutrientDictionaryItem) => {
          this.mnUnit = null == micronutrient ? '' : micronutrient.unit;
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

  private init(dataPromise: Promise<Array<TopFoodSource>>): void {
    this.loadingSrc.next(true);
    dataPromise
      .then((data: Array<TopFoodSource>) => {
        this.data = data;
        if (null == data) {
          // this.notificationService.sendNegative('An error occurred -', 'data could not be loaded');
          throw new Error('data error');
        }

        // console.log('top 20 table data: ', data);
        this.dataSource = new MatTableDataSource(data);
        this.errorSrc.next(false);
        this.chartDataGroup = null;
        this.chartDataGenus = null;
        // force change detection to:
        // remove chart before re-setting it to stop js error
        // show table and init paginator and sorter
        this.cdr.detectChanges();

        this.dataSource.sort = this.sort;

        if (this.tmpCounter === 0) {
          this.chartDataGenus = this.initTreemap(data, 'foodGenusName', 'foodGroupName', 'Food Genus');
          this.tmpCounter++;
        }

        // this.chartDataGroup = this.initTreemap(data, 'foodGroupName', 'foodGroupName', 'Food Group');
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

  public initTreemap(
    data: Array<TopFoodSource>,
    dataField: string,
    backgroundFillField: string,
    tooltipTitle: string,
  ): Chart {
    // Convert foodGenusName to titlecase
    data = (data as Array<Mutable<TopFoodSource>>).map((value) => {
      value.foodGenusName = this.titlecasePipe.transform(value.foodGenusName);
      return value;
    }) as Array<TopFoodSource>;
    // console.debug(data);
    // console.log(this.c1.nativeElement, 'canvas');
    const ctx = this.c1.nativeElement.getContext('2d');
    const generatedChart = new Chart(ctx, {
      // const generatedChart: ChartJSObject = {
      type: 'treemap',
      data: {
        datasets: [
          {
            data: [],
            // tree: [15, 6, 6, 5, 4, 3, 2, 2], // TODO: use real data format
            tree: data as any,
            key: 'dailyMnContribution',
            groups: [dataField],
            captions: {
              display: true,
              color: '#ffffff',
              font: {
                family: 'Quicksand',
                size: 12,
                style: 'normal',
              },
            },
            backgroundColor: (result: any) => {
              // // TODO: fix type
              // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              // const groupedChartData: ChartDataset = result['dataset']['data'];
              // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              // const groupedChartDataAtCurrentIndex = groupedChartData[result['dataIndex']];
              // if (groupedChartDataAtCurrentIndex) {
              //   // TODO: find a cleaner way to access this data
              //   const backgroundTextString =
              //     result['dataset']['data'][result['dataIndex']]['_data']['children'][0][backgroundFillField];
              //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              //   //return this.genColorHex(groupedChartDataAtCurrentIndex['g']);
              //   return this.genColorHex(backgroundTextString);
              // } else {
              return '#000';
              // }
            },
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: false,
            text: this.title,
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: (item: any) => {
                // TODO: fix type
                if (dataField !== 'foodGroupName') {
                  const dataItem = data[item[0].index];
                  return `${tooltipTitle} (Parent group: ${dataItem.foodGroupName})`;
                } else {
                  return tooltipTitle;
                }
              },
              label: (item: any) => {
                // TODO: fix type
                return 'string';
                // const dataset: ChartDataset = result.datasets[item.datasetIndex];
                // const dataItem: number | number[] | Point = dataset.data[item.index];
                // // tslint:disable-next-line: no-string-literal

                // const label: string = dataItem['g'] as string;
                // // tslint:disable-next-line: no-string-literal
                // const value: string = dataItem['v'] as string;
                // if (this.quickMapsService.FoodSystemsDataSource.get().dataLevel === DataLevel.COUNTRY) {
                //   return `${this.titlecasePipe.transform(label)}: ${Number(value).toPrecision(4)} ${
                //     this.quickMapsService.micronutrient.get().unit
                //   }/capita/day`;
                // } else {
                //   return `${this.titlecasePipe.transform(label)}: ${Number(value).toPrecision(4)} ${
                //     this.quickMapsService.micronutrient.get().unit
                //   }/AFE/day`;
                // }
              },
            },
          },
        },
        maintainAspectRatio: false,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // const chartForRender: Chart = JSON.parse(JSON.stringify(generatedChart));
    // this.chartPNG = this.qcService.getChartAsImageUrl(chartForRender, 'png');
    // this.chartPDF = this.qcService.getChartAsImageUrl(chartForRender, 'pdf');

    return generatedChart;
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<FoodItemsDialogData>(FoodItemsComponent, {
      title: this.title,
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
  title: string;
  data: Array<TopFoodSource>;
  selectedTab: number;
}
