/* eslint-disable @typescript-eslint/dot-notation */
import {
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  Inject,
  Optional,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TopFoodSource } from 'src/app/apiAndObjects/objects/topFoodSource';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { QuickMapsService } from '../../../quickMaps.service';
import 'chartjs-chart-treemap';
import { ChartData, ChartDataSets, ChartPoint, ChartTooltipItem } from 'chart.js';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { CardComponent } from 'src/app/components/card/card.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
@Component({
  selector: 'app-food-items',
  templateUrl: './foodItems.component.html',
  styleUrls: [
    '../../expandableTabGroup.scss',
    './foodItems.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodItemsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  @Input() card: CardComponent;

  public title = 'Top 20 Food Items';

  public chartData: ChartJSObject;
  public displayedColumns = ['foodex2Name', 'value'];
  public dataSource: MatTableDataSource<TopFoodSource>;

  private data: Array<TopFoodSource>;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  constructor(
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<FoodItemsDialogData>,
  ) { }

  ngOnInit(): void {
    // if displayed within a card component init interactions with the card
    if (null != this.card) {
      this.card.title = this.title;
      this.card.showExpand = true;
      this.card
        .setLoadingObservable(this.loadingSrc.asObservable())
        .setErrorObservable(this.errorSrc.asObservable());

      this.subscriptions.push(
        this.card.onExpandClickObs.subscribe(() => this.openDialog())
      );

      // respond to parameter updates
      this.subscriptions.push(
        this.quickMapsService.parameterChangedObs.subscribe(() => {
          this.init(this.currentDataService.getTopFood(
            this.quickMapsService.countryId,
            [this.quickMapsService.micronutrientId],
            this.quickMapsService.popGroupId,
            // this.quickMapsService.mndDataId,
          ));
        })
      );
    } else if (null != this.dialogData) {
      // if displayed within a dialog use the data passed in
      this.init(Promise.resolve(this.dialogData.dataIn.data));
    }
  }

  private init(dataPromise: Promise<Array<TopFoodSource>>): void {
    this.loadingSrc.next(true);
    dataPromise
      .then((data: Array<TopFoodSource>) => {
        this.data = data;
        if (null == data) {
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
      .catch((err) => {
        this.errorSrc.next(true);
        console.error(err);
      })
      .finally(() => {
        this.loadingSrc.next(false);
        this.cdr.detectChanges();
      });
  }

  private initTreemap(data: Array<TopFoodSource>): void {
    this.chartData = {
      type: 'treemap',
      data: {
        datasets: [
          {
            tree: data,
            key: 'value',
            groups: ['foodex2Name'],
            groupLabels: true,
            fontColor: '#ffffff',
            fontFamily: 'Quicksand',
            fontSize: 14,
            fontStyle: 'normal',
            // random shade of color palette purple
            backgroundColor: () => {
              const calculatedHSLValue = Math.floor(Math.random() * (70 - 10 + 1) + 10).toString();
              return `hsl(271, 70%, ${calculatedHSLValue}%)`;
            },
          },
        ],
      },
      options: {
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
              return label + ': ' + value;
            },
          },
        },
      },
    };
  }

  // public applyFilter(event: Event): void {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //   }
  //   {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<FoodItemsDialogData>(FoodItemsComponent, { data: this.data });
  }
}

export interface FoodItemsDialogData {
  data: Array<TopFoodSource>;
}
