/* eslint-disable @typescript-eslint/dot-notation */
import {
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PopulationGroup } from 'src/app/apiAndObjects/objects/populationGroup';
import { TopFoodSource } from 'src/app/apiAndObjects/objects/topFoodSource';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { QuickMapsService } from '../../../quickMaps.service';
import 'chartjs-chart-treemap';
import { ChartData, ChartDataSets, ChartPoint, ChartTooltipItem } from 'chart.js';
import { Subscription } from 'rxjs';
import { GridsterItem } from 'angular-gridster2';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
@Component({
  selector: 'app-food-items',
  templateUrl: './foodItems.component.html',
  styleUrls: ['./foodItems.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  //encapsulation: ViewEncapsulation.None,
})
export class FoodItemsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input()
  widget;
  @Input()
  resizeEvent: EventEmitter<GridsterItem>;
  resizeSub: Subscription;

  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;
  public popGroupOptions = new Array<PopulationGroup>();
  public chartData: ChartJSObject;
  public displayedColumns = ['foodex2Name', 'value'];
  public dataSource: MatTableDataSource<TopFoodSource>;
  public loading = false;
  public error = false;

  constructor(
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      if (widget === this.widget) {
        // or check id , type or whatever you have there
        // resize your widget, chart, map , etc.
        // console.log(]widget);
      }
    });

    void this.currentDataService
      .getTopFood(
        this.quickMapsService.countryId,
        [this.quickMapsService.micronutrientId],
        this.quickMapsService.popGroupId,
        // this.quickMapsService.mndDataIdObs,
      )
      .then((foodData: Array<TopFoodSource>) => {
        this.dataSource = new MatTableDataSource(foodData);
        this.error = false;
        this.chartData = null;
        // force change detection to:
        // remove chart before re-setting it to stop js error
        // show table and init paginator and sorter
        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.initTreemap(foodData);
      })
      .catch((err) => {
        this.error = true;
        console.error(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }

  public initTreemap(data: Array<TopFoodSource>): void {
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
        // maintainAspectRatio: false,
        // responsive: true,
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

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
    }
    {
      this.dataSource.paginator.firstPage();
    }
  }

  public openDialog(): void {
    void this.dialogService.openChartDialog(this.chartData);
  }
}
