import {
  ChangeDetectorRef,
  ViewChild,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { MonthlyFoodGroup } from 'src/app/apiAndObjects/objects/monthlyFoodGroup';
import { MonthlyFoodGroups } from 'src/app/apiAndObjects/objects/monthlyFoodGroups';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { QuickMapsService } from '../../../quickMaps.service';
import { GridsterItem } from 'angular-gridster2';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-monthly-card',
  templateUrl: './monthlyCard.component.html',
  styleUrls: ['./monthlyCard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyCardComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() widget;
  @Input() resizeEvent: EventEmitter<GridsterItem>;
  resizeSub: Subscription;
  public loading = false;
  public error = false;

  public dataSource: MatTableDataSource<MonthlyFoodGroup>;
  public chartData: ChartJSObject;

  public displayedColumns = [
    'month',
    // 'unitPerc',
    'vegetablesPerc',
    'cerealGrainsPerc',
    'dairyPerc',
    'fatPerc',
    'fruitPerc',
    'meatPerc',
    'tubersPerc',
    'nutsPerc',
    'miscPerc',
    'supplyTotal',
    // 'supplyUnit',
  ];

  constructor(
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      if (widget === this.widget) {
        // or check id , type or whatever you have there
        // resize your widget, chart, map , etc.
        // console.log(widget);
      }
    });
    this.quickMapsService.parameterChangedObs.subscribe(() => {
      this.loading = true;
      this.cdr.markForCheck();
      void this.currentDataService
        .getMonthlyFoodGroups(
          this.quickMapsService.countryId,
          [this.quickMapsService.micronutrientId],
          this.quickMapsService.popGroupId,
          this.quickMapsService.mndDataId,
        )
        .then((data: MonthlyFoodGroups) => {
          this.dataSource = new MatTableDataSource(data.all);
          this.error = false;
          this.chartData = null;
          // force change detection to:
          // remove chart before re-setting it to stop js error
          // show table and init paginator and sorter
          this.cdr.markForCheck();

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.initialiseGraph(data.all);
        })
        .catch((err) => {
          this.error = true;
          console.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    });
  }

  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }

  public initialiseGraph(data: Array<MonthlyFoodGroup>): void {
    this.chartData = {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Cereal Grains',
            data: data.map((year) => year.cerealGrainsPerc),
            backgroundColor: () => 'rgba(255, 165, 0, 0.6)',
          },
          {
            label: 'Dairy',
            data: data.map((year) => year.dairyPerc),
            backgroundColor: () => 'rgba(248,228,165)',
          },
          {
            label: 'Fat',
            data: data.map((year) => year.fatPerc),
            backgroundColor: () => 'rgba(0, 0, 255, 0.6)',
          },
          {
            label: 'Nuts',
            data: data.map((year) => year.nutsPerc),
            backgroundColor: () => 'rgba(172, 114, 87, 0.6)',
          },
          {
            label: 'Misc',
            data: data.map((year) => year.miscPerc),
            backgroundColor: () => 'rgba(238, 130, 238, 0.6)',
          },
          {
            label: 'Fruit',
            data: data.map((year) => year.fruitPerc),
            backgroundColor: () => 'rgba(100, 181, 220, 0.6)',
          },
          {
            label: 'Meat',
            data: data.map((year) => year.meatPerc),
            backgroundColor: () => 'rgba(255, 0, 0, 0.6)',
          },
          {
            label: 'Tubers',
            data: data.map((year) => year.tubersPerc),
            backgroundColor: () => 'rgba(255, 235, 59, 0.6)',
          },
          {
            label: 'Vegetables',
            data: data.map((year) => year.vegetablesPerc),
            backgroundColor: () => 'rgba(60, 179, 113, 0.6)',
          },
        ],
      },
      options: {
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
              scaleLabel: {
                display: true,
                labelString: 'percentage',
              },
            },
          ],
        },
      },
    };
  }

  public openDialog(): void {
    void this.dialogService.openChartDialog(this.chartData,
      {
        datasource: this.dataSource,
        columnIdentifiers: this.displayedColumns
      });
  }
}
