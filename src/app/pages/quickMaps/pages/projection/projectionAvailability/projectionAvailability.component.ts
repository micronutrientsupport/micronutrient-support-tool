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
import { QuickMapsService } from '../../../quickMaps.service';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectedAvailability } from 'src/app/apiAndObjects/objects/projectedAvailability';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { MatTabGroup } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { QuickchartService } from 'src/app/services/quickChart.service';
import { ChartTooltipItem, ChartData, ChartDataSets, ChartPoint } from 'chart.js';
import { SignificantFiguresPipe } from 'src/app/pipes/significantFigures.pipe';
import { ProjectionsSummary } from 'src/app/apiAndObjects/objects/projectionSummary';
import { ProjectionDataService } from 'src/app/services/projectionData.service';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { ImpactScenarioDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/impactScenarioDictionaryItem';
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
  private baselineScenario: ImpactScenarioDictionaryItem;
  private subscriptions = new Array<Subscription>();
  constructor(
    private dictionaryService: DictionaryService,
    private projectionDataService: ProjectionDataService,
    public quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private qcService: QuickchartService,
    private sigFig: SignificantFiguresPipe,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<ProjectionAvailabilityDialogData>,
  ) {}
  ngAfterViewInit(): void {
    // get baseline scenario
    void this.dictionaryService.getDictionaries([DictionaryType.IMPACT_SCENARIOS]).then((dicts) => {
      this.baselineScenario = dicts
        .shift()
        .getItems<ImpactScenarioDictionaryItem>()
        .find((item) => item.isBaseline);
      // if displayed within a card component init interactions with the card
      if (null != this.card) {
        this.card.showExpand = true;
        this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());
        this.subscriptions.push(this.card.onExpandClickObs.subscribe(() => this.openDialog()));
        this.subscriptions.push(this.card.onInfoClickObs.subscribe(() => this.navigateToInfoTab()));

        this.subscriptions.push(
          this.quickMapsService.dietParameterChangedObs.subscribe(() => {
            // projections only available if isInImpact flag set
            const country = this.quickMapsService.country.get();
            const micronutrient = this.quickMapsService.micronutrient.get();

            if (null != micronutrient && micronutrient.isInImpact) {
              this.title = 'Projected ' + micronutrient.name + ' availability to 2050';
              this.card.title = this.title;

              //  only if all set
              if (null != country && null != micronutrient) {
                this.init(
                  this.projectionDataService.getProjectedAvailabilities(country, micronutrient),
                  this.projectionDataService.getProjectionSummaries(country, micronutrient, this.baselineScenario),
                );
              }
            }
          }),
        );

        // respond to parameter updates
      } else if (null != this.dialogData) {
        // if displayed within a dialog use the data passed in
        this.init(Promise.resolve(this.dialogData.dataIn.data), Promise.resolve(this.dialogData.dataIn.summary));
        this.title = this.dialogData.dataIn.title;
        this.tabGroup.selectedIndex = this.dialogData.dataIn.selectedTab;
        this.cdr.detectChanges();
      }
    });
  }
  public navigateToInfoTab(): void {
    this.selectedTab = 3;
    this.cdr.detectChanges();
  }
  private init(dataPromise: Promise<Array<ProjectedAvailability>>, summaryPromise: Promise<ProjectionsSummary>): void {
    this.loadingSrc.next(true);
    Promise.all([dataPromise, summaryPromise])
      .then((results: [Array<ProjectedAvailability>, ProjectionsSummary]) => {
        this.data = results[0];
        this.projectionsSummary = results[1];
        if (null == this.data) {
          // this.notificationService.sendNegative('An error occurred -', 'data could not be loaded');
          throw new Error('data error');
        }
        const filteredData: Array<ProjectedAvailability> = this.data.filter(
          (item: ProjectedAvailability) => item.country === this.quickMapsService.country.get()?.id,
        );
        this.errorSrc.next(false);
        this.chartData = null;

        this.initialiseGraph(filteredData);
        // show table and init paginator and sorter
        this.initialiseTable(filteredData);
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
  private initialiseTable(data: Array<ProjectedAvailability>): void {
    const micronutrient = this.quickMapsService.micronutrient.get();
    this.columns = [
      { columnDef: 'country', header: 'Country', cell: (element: ProjectedAvailability) => element.country },
      { columnDef: 'year', header: 'Year', cell: (element: ProjectedAvailability) => element.year },
      { columnDef: 'scenario', header: 'Scenario', cell: (element: ProjectedAvailability) => element.scenario },
      {
        columnDef: micronutrient.id,
        header: micronutrient.id + ' Availability',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        cell: (element: ProjectedAvailability) => element.data[micronutrient.id].value,
      },
      {
        columnDef: micronutrient.id + 'Diff',
        header: '% Difference from previous year',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-plus-operands
        cell: (element: ProjectedAvailability) => element.data[micronutrient.id].diff,
      },
    ];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    this.displayedColumns = this.columns.map((c) => c.columnDef);
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }
  private initialiseGraph(data: Array<ProjectedAvailability>): void {
    // console.debug(data);
    const micronutrient = this.quickMapsService.micronutrient.get();
    const datasets = this.data.reduce((res, obj: ProjectedAvailability) => {
      if (!res[obj.scenario]) {
        res[obj.scenario] = [];
      }
      res[obj.scenario].push(obj);
      return res;
    }, {});
    console.debug(datasets);
    const generatedChart: ChartJSObject = {
      type: 'line',
      data: {
        labels: data.filter((item) => item.scenario === 'SSP1').map((item) => item.year),
        // TODO: loop through scenarios from db so these three aren't hard-coded?
        datasets: [
          {
            label: 'SSP1',
            data: data.filter((item) => item.scenario === 'SSP1').map((item) => item.data[micronutrient.id].value),
            fill: false,
            borderColor: '#6FCF97',
          },
          {
            label: 'SSP2',
            data: data.filter((item) => item.scenario === 'SSP2').map((item) => item.data[micronutrient.id].value),
            fill: false,
            borderColor: '#9B51E0',
          },
          {
            label: 'SSP3',
            data: data.filter((item) => item.scenario === 'SSP3').map((item) => item.data[micronutrient.id].value),
            fill: false,
            borderColor: '#FF3E7A',
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
                labelString: micronutrient.name + ' availability in ' + micronutrient.unit + '/capita/day',
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
              return label + ': ' + valueToSigFig + ' (' + sigFigLength + ' s.f)';
            },
          },
        },
        annotation: {
          annotations: [
            {
              type: 'line',
              mode: 'horizontal',
              scaleID: 'y-axis-0',
              value: this.projectionsSummary.recommended,
              borderWidth: 2.0,
              borderColor: 'rgba(200,0,0,0.5)',
              label: {
                enabled: true,
                content: 'Threshold: ' + this.projectionsSummary.recommended,
                backgroundColor: 'rgba(200,0,0,0.8)',
              },
            },
          ],
        },
      },
    };
    this.chartData = generatedChart;
    const chartForRender: ChartJSObject = JSON.parse(JSON.stringify(generatedChart));
    this.chartPNG = this.qcService.getChartAsImageUrl(chartForRender, 'png');
    this.chartPDF = this.qcService.getChartAsImageUrl(chartForRender, 'pdf');
  }
  private openDialog(): void {
    void this.dialogService.openDialogForComponent<ProjectionAvailabilityDialogData>(ProjectionAvailabilityComponent, {
      title: this.title,
      data: this.data,
      summary: this.projectionsSummary,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }
}
export interface ProjectionAvailabilityDialogData {
  title: string;
  data: Array<ProjectedAvailability>;
  summary: ProjectionsSummary;
  selectedTab: number;
}
