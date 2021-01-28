import {
  ChangeDetectorRef,
  ViewChild,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Optional,
  Inject,
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
import { Card2Component } from 'src/app/components/card2/card2.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
@Component({
  selector: 'app-monthly-food',
  templateUrl: './monthlyFood.component.html',
  styleUrls: [
    '../expandableTabGroup.scss',
    './monthlyFood.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyFoodComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() card: Card2Component;

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

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  constructor(
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: DialogData,
  ) { }

  ngOnInit(): void {
    // if displayed within a card component init interactions with the card
    if (null != this.card) {
      this.card.title = 'Monthly Food Card';
      this.card.showExpand = true;
      this.card
        .setLoadingObservable(this.loadingSrc.asObservable())
        .setErrorObservable(this.errorSrc.asObservable());

      this.subscriptions.push(
        this.card.onExpandClickObs.subscribe(() => this.openDialog())
      );
    }

    this.quickMapsService.parameterChangedObs.subscribe(() => {
      this.loadingSrc.next(true);
      void this.currentDataService
        .getMonthlyFoodGroups(
          this.quickMapsService.countryId,
          [this.quickMapsService.micronutrientId],
          this.quickMapsService.popGroupId,
          this.quickMapsService.mndDataId,
        )
        .then((data: MonthlyFoodGroups) => {
          if (null == data) {
            throw new Error('data error');
          }

          this.dataSource = new MatTableDataSource(data.all);
          this.errorSrc.next(false);
          this.chartData = null;
          // force change detection to:
          // remove chart before re-setting it to stop js error
          // show table and init paginator and sorter
          this.cdr.detectChanges();

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.initialiseGraph(data.all);
        })
        .catch((err) => {
          this.errorSrc.next(true);
          console.error(err);
        })
        .finally(() => {
          this.loadingSrc.next(false);
          this.cdr.detectChanges();
        });
    });
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

  private openDialog(): void {
    void this.dialogService.openDialogForComponent(MonthlyFoodComponent);
  }
}
