import {
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  Optional,
  Inject,
  Component,
  AfterViewInit,
  ViewChild,
} from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import { CardComponent } from 'src/app/components/card/card.component';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { QuickMapsService } from '../../../quickMaps.service';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectedAvailability } from 'src/app/apiAndObjects/objects/projectedAvailability';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { MatTabGroup } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { NotificationsService } from 'src/app/components/notifications/notification.service';
import { QuickchartService } from 'src/app/services/quickChart.service';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { ChartTooltipItem, ChartData, ChartDataSets, ChartPoint } from 'chart.js';
import { SignificantFiguresPipe } from 'src/app/pipes/significantFigures.pipe';
import { ProjectionsSummary } from 'src/app/apiAndObjects/objects/projectionSummary';
@Component({
  selector: 'app-proj-avail',
  templateUrl: './projectionAvailability.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './projectionAvailability.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SignificantFiguresPipe],
})
export class ProjectionAvailabilityComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort: MatSort;
  @Input() card: CardComponent;

  public title = 'Projected availability';
  public selectedTab: number;
  public headingText = 'Multinutrient';
  public subtHeadingText = '';
  public selectedTimeScale: string;
  public micronutrientName = '';
  public micronutrientId = '';
  public mnUnit = '';
  public projectionsSummary: ProjectionsSummary;
  public dataSource: MatTableDataSource<ProjectedAvailability>;
  public columns = [];
  public displayedColumns = [];
  public chartData: ChartJSObject;
  public chartPNG: string;
  public chartPDF: string;
  private data: Array<ProjectedAvailability>;
  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);
  private subscriptions = new Array<Subscription>();
  private readonly SCENARIO_ID = 'SSP2';

  constructor(
    private notificationService: NotificationsService,
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private qcService: QuickchartService,
    private sigFig: SignificantFiguresPipe,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<ProjectionAvailabilityDialogData>,
  ) {}

  ngAfterViewInit(): void {
    // if displayed within a card component init interactions with the card
    if (null != this.card) {
      this.card.title = this.title;
      this.card.showExpand = true;
      this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

      this.subscriptions.push(this.card.onExpandClickObs.subscribe(() => this.openDialog()));
      this.subscriptions.push(this.card.onInfoClickObs.subscribe(() => this.navigateToInfoTab()));
      this.subscriptions.push(
        this.quickMapsService.micronutrientObs.subscribe((micronutrient: MicronutrientDictionaryItem) => {
          this.mnUnit = null == micronutrient ? '' : micronutrient.unit;
        }),
      );

      // respond to parameter updates
      this.subscriptions.push(
        this.quickMapsService.parameterChangedObs.subscribe(() => {
          this.micronutrientName = this.quickMapsService.micronutrient.name;
          this.micronutrientId = this.quickMapsService.micronutrient.id;
          this.title = 'Projected ' + this.micronutrientName + ' availability to 2050';
          this.card.title = this.title;
          this.init(
            this.currentDataService.getProjectedAvailabilities(
              this.quickMapsService.country,
              [this.quickMapsService.micronutrient],
              this.quickMapsService.dataSource,
            ),
          );
        }),
      );
    } else if (null != this.dialogData) {
      // if displayed within a dialog use the data passed in
      // this.init(Promise.resolve(this.dialogData.dataIn.data));
      // this.tabGroup.selectedIndex = this.dialogData.dataIn.selectedTab;
      // this.cdr.detectChanges();
    }
  }

  public navigateToInfoTab(): void {
    this.selectedTab = 3;
    this.cdr.detectChanges();
  }

  private init(dataPromise: Promise<Array<ProjectedAvailability>>): void {
    this.loadingSrc.next(true);

    void this.currentDataService
      .getProjectionSummary(this.quickMapsService.country.id, this.quickMapsService.micronutrient, this.SCENARIO_ID)
      .catch(() => null)
      .then((summary: ProjectionsSummary) => {
        // console.log(summary.target);
        this.projectionsSummary = summary;

        dataPromise
          .then((data: Array<ProjectedAvailability>) => {
            this.data = data;
            if (null == data) {
              // this.notificationService.sendNegative('An error occurred -', 'data could not be loaded');
              throw new Error('data error');
            }

            const filteredData: Array<ProjectedAvailability> = data.filter(
              (item: ProjectedAvailability) => item.country === this.quickMapsService.country.id,
            );
            this.errorSrc.next(false);
            this.chartData = null;
            // force change detection to:
            // remove chart before re-setting it to stop js error
            this.cdr.detectChanges();
            this.initialiseGraph(filteredData);

            // show table and init paginator and sorter
            this.initialiseTable(filteredData);
          })
          .catch(() => this.errorSrc.next(true))
          .finally(() => {
            this.loadingSrc.next(false);
            this.cdr.detectChanges();
          });
      });
  }

  private initialiseTable(data: Array<ProjectedAvailability>): void {
    this.columns = [
      { columnDef: 'country', header: 'Country', cell: (element: ProjectedAvailability) => `${element.country}` },
      { columnDef: 'year', header: 'Year', cell: (element: ProjectedAvailability) => `${element.year}` },
      { columnDef: 'scenario', header: 'Scenario', cell: (element: ProjectedAvailability) => `${element.scenario}` },
      {
        columnDef: this.micronutrientId.toLowerCase(),
        header: this.micronutrientId.toLowerCase() + ' Availability',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        cell: (element: ProjectedAvailability) => element[this.micronutrientId.toLowerCase()],
      },
      {
        columnDef: this.micronutrientId.toLowerCase() + 'Diff',
        header: '% Difference from previous year',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-plus-operands
        cell: (element: ProjectedAvailability) => element[this.micronutrientId.toLowerCase() + 'Diff'],
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    this.displayedColumns = this.columns.map((c) => c.columnDef);

    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }

  private initialiseGraph(data: Array<ProjectedAvailability>): void {
    const generatedChart: ChartJSObject = {
      type: 'line',
      data: {
        labels: data.filter((item) => item.scenario === 'SSP1').map((item) => item.year),
        datasets: [
          {
            label: 'SSP1',
            data: data.filter((item) => item.scenario === 'SSP1').map((item) => item.c),
            fill: false,
            borderColor: 'rgb(255, 0, 0)',
            // backgroundColor: 'rgba(12, 92, 90, 0.6)',
          },
          {
            label: 'SSP2',
            data: data.filter((item) => item.scenario === 'SSP2').map((item) => item.c),
            fill: false,
            borderColor: 'rgb(0, 255, 0)',
            // backgroundColor: 'rgba(12, 92, 225, 0.6)',
          },
          {
            label: 'SSP3',
            data: data.filter((item) => item.scenario === 'SSP3').map((item) => item.c),
            fill: false,
            borderColor: 'rgb(0, 0, 255)',
            // backgroundColor: 'rgba(48, 102, 133, 0.6)',
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        title: {
          display: false,
          text: this.title,
        },
        legend: {
          display: true,
          position: 'bottom',
          align: 'center',
        },
        scales: {
          xAxes: [{}],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: this.micronutrientName + ' availability in ' + this.mnUnit + '/capita/day',
              },
            },
          ],
        },
        tooltips: {
          callbacks: {
            label: (item: ChartTooltipItem, result: ChartData) => {
              const dataset: ChartDataSets = result.datasets[item.datasetIndex];
              const dataItem: number | number[] | ChartPoint = dataset.data[item.index];
              const label: string = dataset.label;
              const value: number = dataItem as number;
              const sigFigLength = Math.ceil(Math.log10(value + 1));
              const valueToSigFig = this.sigFig.transform(value, sigFigLength);
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              return label + ': ' + valueToSigFig + ' (' + sigFigLength + ' s.f)';
            },
          },
        },
        annotation: {
          annotations: [
            {
              type: 'line',
              id: 'defLine',
              mode: 'horizontal',
              scaleID: 'y-axis-0',
              value: this.projectionsSummary.target,
              borderWidth: 2.0,
              borderColor: 'rgba(200,0,0,0.5)',
              label: {
                enabled: true,
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                content: 'Threshold: ' + this.projectionsSummary.target,
                backgroundColor: 'rgba(200,0,0,0.8)',
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
    void this.dialogService.openDialogForComponent<ProjectionAvailabilityDialogData>(ProjectionAvailabilityComponent, {
      data: this.data,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProjectionAvailabilityDialogData {
  data: Array<ProjectedAvailability>;
  selectedTab: number;
}
