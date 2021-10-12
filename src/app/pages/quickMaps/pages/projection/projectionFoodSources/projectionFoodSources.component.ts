/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  ChangeDetectionStrategy,
  Input,
  Component,
  ChangeDetectorRef,
  Optional,
  Inject,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { QuickMapsService } from '../../../quickMaps.service';
import { CardComponent } from 'src/app/components/card/card.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { ChartJSObject, ChartsJSDataObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import ColorHash from 'color-hash-ts';
import { QuickchartService } from 'src/app/services/quickChart.service';
import { ChartData, ChartDataSets, ChartPoint, ChartTooltipItem } from 'chart.js';
import { SignificantFiguresPipe } from 'src/app/pipes/significantFigures.pipe';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { FoodSourceGroup } from 'src/app/apiAndObjects/objects/enums/foodSourceGroup.enum';
import { MicronutrientProjectionSource } from 'src/app/apiAndObjects/objects/micronutrientProjectionSource.abstract';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { ImpactScenarioDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/impactScenarioDictionaryItem';
import { ProjectionDataService } from 'src/app/services/projectionData.service';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
@Component({
  selector: 'app-proj-food-sources ',
  templateUrl: './projectionFoodSources.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './projectionFoodSources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SignificantFiguresPipe],
})
export class ProjectionFoodSourcesComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  @Input() card: CardComponent;

  public title = 'Projection Food Sources for';
  public selectedTab: number;
  public micronutrientsDictionary: Dictionary;
  public micronutrientName = '';
  public mnUnit = '';
  public chartData: ChartJSObject;
  public displayedColumns = ['name', 'value'];
  public dataSource = new MatTableDataSource();
  public impactScenariosDict: Dictionary;
  public projectionFoodFormGroup: FormGroup;
  public groupByOptions = Object.values(FoodSourceGroup);
  public selectedGroup = '';

  // TODO: from API??
  public yearOptions = new Array<string>();
  public chartPNG: string;
  public chartPDF: string;
  public csvDownloadData: Array<MicronutrientProjectionSource> = [];

  public data: Array<MicronutrientProjectionSource>;

  private sort: MatSort;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  constructor(
    private dictionaryService: DictionaryService,
    private projectionDataService: ProjectionDataService,
    private quickMapsService: QuickMapsService,
    private cdr: ChangeDetectorRef,
    private qcService: QuickchartService,
    private fb: FormBuilder,
    private sigFig: SignificantFiguresPipe,
    private dialogService: DialogService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData,
  ) {
    // 2010 to 2050 in 5 year jumps
    for (let i = 0; i < 9; i++) {
      this.yearOptions.push(String(2010 + i * 5));
    }

    this.projectionFoodFormGroup = this.fb.group({
      groupedBy: this.groupByOptions[0],
      scenario: null,
      year: this.yearOptions[0],
    });
    this.selectedGroup = this.groupByOptions[0];

    void this.dictionaryService.getDictionaries([DictionaryType.IMPACT_SCENARIOS]).then((dicts) => {
      this.impactScenariosDict = dicts.shift();

      const baselineScenario = this.impactScenariosDict
        .getItems<ImpactScenarioDictionaryItem>()
        .find((item) => item.isBaseline);

      this.projectionFoodFormGroup.get('groupedBy').valueChanges.subscribe((value) => {
        this.init();
        this.selectedGroup = value;
      });
      this.projectionFoodFormGroup.get('scenario').valueChanges.subscribe(() => {
        this.init();
      });
      this.projectionFoodFormGroup.get('year').valueChanges.subscribe(() => {
        this.init();
      });

      this.projectionFoodFormGroup.get('scenario').setValue(baselineScenario);
    });
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(this.card.onInfoClickObs.subscribe(() => this.navigateToInfoTab()));
    this.subscriptions.push(this.card.onExpandClickObs.subscribe(() => this.openDialog()));

    this.subscriptions.push(
      this.quickMapsService.micronutrientObs.subscribe((micronutrient: MicronutrientDictionaryItem) => {
        this.mnUnit = null == micronutrient ? '' : micronutrient.unit;
      }),
    );

    if (null != this.card) {
      this.card.title = this.title;
      this.card.showExpand = true;
      this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

      this.subscriptions.push(
        this.quickMapsService.dietParameterChangedObs.subscribe(() => {
          this.micronutrientName = this.quickMapsService.micronutrient.name;
          this.title = 'Projection Food Sources for ' + this.micronutrientName;
          this.card.title = this.title;
          this.init();
        }),
      );
    } else if (null != this.dialogData) {
      this.init();
      this.tabGroup.selectedIndex = this.dialogData.dataIn.selectedTab;
      this.cdr.detectChanges();
    }
  }

  public navigateToInfoTab(): void {
    this.selectedTab = 3;
    this.cdr.detectChanges();
  }

  public changeSelectedGroup(value: string): void {
    this.selectedGroup = value;
  }

  /**
   * Ensures consistency between table and graph tab controls of same type
   */
  public selectedTabChanged(): void {
    this.projectionFoodFormGroup.get('groupedBy').setValue(this.projectionFoodFormGroup.get('groupedBy').value);
    this.projectionFoodFormGroup.get('scenario').setValue(this.projectionFoodFormGroup.get('scenario').value);
  }

  private init(): void {
    const scenario = this.projectionFoodFormGroup.get('scenario').value;
    if (null != scenario) {
      this.loadingSrc.next(true);
      this.projectionDataService
        .getProjectionSources(
          this.projectionFoodFormGroup.get('groupedBy').value,
          this.quickMapsService.country,
          this.quickMapsService.micronutrient,
          this.projectionFoodFormGroup.get('scenario').value.id,
        )
        .then((data: Array<MicronutrientProjectionSource>) => {
          this.data = data;
          if (null == data) {
            throw new Error('data error');
          }

          //
          this.dataSource = new MatTableDataSource(data);
          // this.csvDownloadData.push(data);

          // const filteredTableDataArray = [];
          const foodTypes = [...new Set(data.map((item) => item.name))];
          const quinquennialPeriod = [...new Set(data.map((item) => item.year))];

          // Generate the stacked chart
          const stackedChartData = {
            labels: quinquennialPeriod,
            datasets: [],
          };
          foodTypes.forEach((thing, index) => {
            stackedChartData.datasets.push({
              label: foodTypes[index],
              data: data.filter((item) => item.name === foodTypes[index]).map((item) => item.value),
              backgroundColor: this.genColorHex(foodTypes[index]),
            });
          });

          // Generate the table
          const selectedYearString = String(this.projectionFoodFormGroup.get('year').value);
          const tableData = data.filter((item) => String(item.year) === selectedYearString);
          // quinquennialPeriod.forEach((currentYear) => {
          //   const filteredTableData = new Array<MicronutrientProjectionSourceTable>();

          //   foodTypes.forEach((thing, index) => {
          //     filteredTableData.push({
          //       year: currentYear,
          //       foodName: foodTypes[index],
          //       value: data
          //         .filter((item) => item.year === currentYear)
          //         // .filter((item) => item.name === foodTypes[index])
          //         .map((item) => item.value)[0],
          //     });
          //   });
          //   filteredTableDataArray.push(filteredTableData);
          // });

          this.errorSrc.next(false);
          this.chartData = null;

          // remove chart before re-setting it to stop js error
          this.cdr.detectChanges();

          this.initialiseGraph(stackedChartData);
          this.initialiseTable(tableData);
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
  }

  private initialiseTable(data: Array<MicronutrientProjectionSource>): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }

  private initialiseGraph(stackedChartData: ChartsJSDataObject): void {
    const generatedChart: ChartJSObject = {
      type: 'bar',
      data: stackedChartData,
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
              scaleLabel: {
                display: true,
                labelString: this.micronutrientName + ' in ' + this.mnUnit + '/capita/day',
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
      },
    };

    this.chartData = generatedChart;
    const chartForRender: ChartJSObject = JSON.parse(JSON.stringify(generatedChart));
    this.chartPNG = this.qcService.getChartAsImageUrl(chartForRender, 'png');
    this.chartPDF = this.qcService.getChartAsImageUrl(chartForRender, 'pdf');
  }

  private genColorHex(foodTypeIndex: string) {
    const colorHash = new ColorHash();
    return colorHash.hex(foodTypeIndex);
  }

  private openDialog(): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    void this.dialogService.openDialogForComponent<ProjectionFoodSourcesDialogData>(ProjectionFoodSourcesComponent, {
      data: this.data,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }
}

export interface ProjectionFoodSourcesDialogData {
  data: Array<MicronutrientProjectionSource>;
  selectedTab: number;
}

// export interface MicronutrientProjectionSourceTable {
//   year: number;
//   foodName: string;
//   value: number;
// }
