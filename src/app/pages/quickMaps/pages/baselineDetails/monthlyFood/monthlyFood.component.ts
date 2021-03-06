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
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { MonthlyFoodGroup } from 'src/app/apiAndObjects/objects/monthlyFoodGroup';
import { MonthlyFoodGroups } from 'src/app/apiAndObjects/objects/monthlyFoodGroups';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { QuickMapsService } from '../../../quickMaps.service';
import { CardComponent } from 'src/app/components/card/card.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { MatTabGroup } from '@angular/material/tabs';
import { NotificationsService } from 'src/app/components/notifications/notification.service';
import { QuickchartService } from 'src/app/services/quickChart.service';
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

  public title = 'Monthly Food';
  public selectedTab: number;

  public dataSource: MatTableDataSource<MonthlyFoodGroup>;
  public chartData: ChartJSObject;
  public chartPNG: string;
  public chartPDF: string;

  public displayedColumns = [
    'monthIndex',
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

  private data: MonthlyFoodGroups;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  constructor(
    private notificationService: NotificationsService,
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
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
        this.quickMapsService.parameterChangedObs.subscribe(() => {
          this.init(
            this.currentDataService.getMonthlyFoodGroups(
              this.quickMapsService.country,
              [this.quickMapsService.micronutrient],
              this.quickMapsService.dataSource,
            ),
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

  private init(dataPromise: Promise<MonthlyFoodGroups>): void {
    this.loadingSrc.next(true);
    dataPromise
      .then((data: MonthlyFoodGroups) => {
        this.data = data;
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

        this.dataSource.sort = this.sort;

        this.initialiseGraph(data.all);
      })
      .catch(() => this.errorSrc.next(true))
      .finally(() => {
        this.loadingSrc.next(false);
        this.cdr.detectChanges();
      });
  }

  private initialiseGraph(data: Array<MonthlyFoodGroup>): void {
    const generatedChart: ChartJSObject = {
      type: 'bar',
      data: {
        labels: data.map((year) => year.month),
        datasets: [
          {
            label: 'Cereal Grains',
            data: data.map((year) => year.cerealGrainsPerc),
            backgroundColor: 'rgba(255, 165, 0, 0.6)',
          },
          {
            label: 'Dairy',
            data: data.map((year) => year.dairyPerc),
            backgroundColor: 'rgba(248,228,165)',
          },
          {
            label: 'Fat',
            data: data.map((year) => year.fatPerc),
            backgroundColor: 'rgba(0, 0, 255, 0.6)',
          },
          {
            label: 'Nuts',
            data: data.map((year) => year.nutsPerc),
            backgroundColor: 'rgba(172, 114, 87, 0.6)',
          },
          {
            label: 'Misc',
            data: data.map((year) => year.miscPerc),
            backgroundColor: 'rgba(238, 130, 238, 0.6)',
          },
          {
            label: 'Fruit',
            data: data.map((year) => year.fruitPerc),
            backgroundColor: 'rgba(100, 181, 220, 0.6)',
          },
          {
            label: 'Meat',
            data: data.map((year) => year.meatPerc),
            backgroundColor: 'rgba(255, 0, 0, 0.6)',
          },
          {
            label: 'Tubers',
            data: data.map((year) => year.tubersPerc),
            backgroundColor: 'rgba(255, 235, 59, 0.6)',
          },
          {
            label: 'Vegetables',
            data: data.map((year) => year.vegetablesPerc),
            backgroundColor: 'rgba(60, 179, 113, 0.6)',
          },
        ],
      },
      options: {
        title: {
          display: false,
          text: this.title,
        },
        legend: {
          display: true,
          position: 'bottom',
          align: 'center',
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
              scaleLabel: {
                display: true,
                labelString: 'percentage',
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
    void this.dialogService.openDialogForComponent<MonthlyFoodDialogData>(MonthlyFoodComponent, {
      data: this.data,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }
}

export interface MonthlyFoodDialogData {
  data: MonthlyFoodGroups;
  selectedTab: number;
}
