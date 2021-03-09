/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
  OnInit,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { QuickMapsService } from '../../../quickMaps.service';
import { CardComponent } from 'src/app/components/card/card.component';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import {
  ProjectedFoodSourcesData,
  ProjectedFoodSourcesTable,
} from 'src/app/apiAndObjects/objects/projectedFoodSources';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { MiscApiService } from 'src/app/services/miscApi.service';
import { ImpactScenario } from 'src/app/apiAndObjects/objects/impactScenario';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { DictionaryService } from 'src/app/services/dictionary.service';
import ColorHash from 'color-hash-ts';
@Component({
  selector: 'app-proj-food-sources ',
  templateUrl: './projectionFoodSources.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './projectionFoodSources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectionFoodSourcesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  @Input() card: CardComponent;

  public title = 'Projection Food Sources for';
  public micronutrientsDictionary: Dictionary;
  public micronutrientName = '';
  public chartData: ChartJSObject;
  public displayedColumns = ['foodName', 'value'];
  public dataSource = new MatTableDataSource();
  public currentImpactScenario: ImpactScenario;
  public projectionFoodFormGroup: FormGroup;
  public groupByOptions = [
    { id: 'commodity', name: 'commodity' },
    { id: 'foodGroup', name: 'food group' },
  ];
  public scenarioOptions = [
    { id: 'SSP1', name: 'SSP1' },
    { id: 'SSP2', name: 'SSP2' },
    { id: 'SSP3', name: 'SSP3' },
  ];
  public yearOptions = [
    { id: 0, name: '2005' },
    { id: 1, name: '2010' },
    { id: 2, name: '2015' },
    { id: 3, name: '2020' },
    { id: 4, name: '2025' },
    { id: 5, name: '2030' },
    { id: 6, name: '2035' },
    { id: 7, name: '2040' },
    { id: 8, name: '2045' },
    { id: 9, name: '2050' },
  ];
  public projectedFoodSourceChartImagePNGSrc: string;

  private sort: MatSort;
  private data: Array<ProjectedFoodSourcesData>;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  constructor(
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
    private dictionaryService: DictionaryService,
    private cdr: ChangeDetectorRef,
    private miscApiService: MiscApiService,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData,
  ) {
    this.projectionFoodFormGroup = this.fb.group({
      groupedBy: 'commodity',
      scenario: 'SSP1',
      year: '2005',
    });
    // this.projectionFoodFormGroup.get('groupedBy').valueChanges.subscribe((value: string) => {
    // TODO: update with live api endpoint
    // });
    this.projectionFoodFormGroup.get('scenario').valueChanges.subscribe(() => {
      if (this.currentImpactScenario) {
        this.init(
          this.currentDataService.getProjectedFoodSourceData(
            this.quickMapsService.countryId,
            this.quickMapsService.micronutrient.id,
            this.projectionFoodFormGroup.get('scenario').value,
          ),
        );
      }
    });
    this.projectionFoodFormGroup.get('year').valueChanges.subscribe(() => {
      if (this.currentImpactScenario) {
        this.init(
          this.currentDataService.getProjectedFoodSourceData(
            this.quickMapsService.countryId,
            this.quickMapsService.micronutrient.id,
            this.projectionFoodFormGroup.get('scenario').value,
          ),
        );
      }
    });
  }

  ngOnInit(): void {
    //
  }

  ngAfterViewInit(): void {
    void this.miscApiService
      .getImpactScenarios()
      .then((result: Array<ImpactScenario>) => {
        this.currentImpactScenario = result.find((o) => o.isBaseline === true);
        this.projectionFoodFormGroup.patchValue({
          scenario: this.currentImpactScenario.name,
        });
      })
      .then(() => {
        if (null != this.card) {
          this.card.title = this.title;
          this.card.showExpand = true;
          this.card
            .setLoadingObservable(this.loadingSrc.asObservable())
            .setErrorObservable(this.errorSrc.asObservable());

          this.subscriptions.push(
            this.quickMapsService.parameterChangedObs.subscribe(() => {
              this.micronutrientName = this.quickMapsService.micronutrient.name;
              this.title = 'Projection Food Sources for ' + this.micronutrientName;
              this.card.title = this.title;
              this.init(
                this.currentDataService.getProjectedFoodSourceData(
                  this.quickMapsService.countryId,
                  this.quickMapsService.micronutrient.id,
                  this.projectionFoodFormGroup.get('scenario').value,
                ),
              );
            }),
          );
        } else if (null != this.dialogData) {
        }
      });
  }

  private init(dataPromise: Promise<Array<ProjectedFoodSourcesData>>): void {
    this.loadingSrc.next(true);
    dataPromise
      .then((data: Array<ProjectedFoodSourcesData>) => {
        this.data = data;
        // console.log('projFoodSource data: ', data);
        if (null == data) {
          throw new Error('data error');
        }

        // Select current countries
        const filteredByCountry: Array<ProjectedFoodSourcesData> = data.filter(
          (item: ProjectedFoodSourcesData) => item.country === this.quickMapsService.countryId,
        );

        // Filter by current impact scenario
        const filteredByScenario: Array<ProjectedFoodSourcesData> = filteredByCountry.filter(
          (item: ProjectedFoodSourcesData) => item.scenario === this.projectionFoodFormGroup.get('scenario').value,
        );

        const filteredTableDataArray = [];
        const listOfFoods = new Array<ProjectedFoodSourcesTable>();
        const foodTypes = [...new Set(data.map((item) => item.commodity))];
        const quinquennialPeriod = [...new Set(data.map((item) => item.year))];

        // Generate the stacked chart
        const stackedChartData = {
          labels: quinquennialPeriod,
          datasets: [],
        };
        foodTypes.forEach((thing, index) => {
          stackedChartData.datasets.push({
            label: foodTypes[index],
            data: filteredByScenario.filter((item) => item.commodity === foodTypes[index]).map((item) => item.value),
            backgroundColor: () => {
              const colorHash = new ColorHash();
              return colorHash.hex(foodTypes[index]);
            },
          });
        });

        // Generate the table
        quinquennialPeriod.forEach((currentYear) => {
          const filteredTableData = new Array<ProjectedFoodSourcesTable>();

          foodTypes.forEach((thing, index) => {
            filteredTableData.push({
              year: currentYear,
              foodName: foodTypes[index],
              value: filteredByScenario
                .filter((item) => item.year === currentYear)
                .filter((item) => item.commodity === foodTypes[index])
                .map((item) => item.value)[0],
            });
          });
          filteredTableDataArray.push(filteredTableData);
        });

        this.errorSrc.next(false);
        this.chartData = null;
        // force change detection to:
        // remove chart before re-setting it to stop js error
        this.cdr.detectChanges();

        console.log('listOfFoods = ', listOfFoods);

        console.log('stackedChartData: ', stackedChartData);

        this.initialiseGraph(stackedChartData);
        this.initialiseTable(filteredTableDataArray, this.projectionFoodFormGroup.get('year').value);
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

  private initialiseTable(data: Array<ProjectedFoodSourcesTable>, yearId: number): void {
    // Data needs to be flattened frmo a nested array as mat-table can't acccess nested data
    const flatten = (arr: Array<ProjectedFoodSourcesTable>) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      arr.reduce(
        (a: ProjectedFoodSourcesTable[], b: ProjectedFoodSourcesTable) => a.concat(Array.isArray(b) ? flatten(b) : b),
        [],
      );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const flattenedData = flatten([data[yearId]]);
    this.dataSource = new MatTableDataSource(flattenedData);
    this.dataSource.sort = this.sort;
  }

  private initialiseGraph(stackedChartData): void {
    // const quinquennialPeriod = [...new Set(graphData.map((item) => item.year))];

    // const barChartData = {
    //   labels: Object.values(quinquennialPeriod),
    //   datasets: [],
    // };

    // graphData.forEach((item: ProjectedFoodSourcesTable) => {
    //   barChartData.datasets.push({
    //     label: item.foodName,
    //     data: item.value,
    //     stack: item.year,
    //     backgroundColor: () => 'rgba(255, 165, 0, 0.6)',
    //   });
    // });

    // quinquennialPeriod.forEach((year, index) => {
    //   const dataAtIndex = graphData[index];
    //   console.log('dataatindex: ', dataAtIndex);

    //   barChartData.datasets.push({
    //     label: year, //need to be foodName
    //     data: graphData.filter((item) => item.year === year),
    //     backgroundColor: () => 'rgba(255, 165, 0, 0.6)',
    //   });
    //   // console.log(barChartData);
    // });

    // console.log(barChartData);

    this.chartData = {
      type: 'bar',
      data: stackedChartData,
      // data: {
      //   labels: barChartData.labels,
      //   datasets: barChartData.datasets,
      //   {
      //     label: 'Millet',
      //     data: barChartData.datasets.map((item: ProjectedFoodSourcesPeriod) => item.data[0].value),
      //     backgroundColor: () => 'rgba(255, 165, 0, 0.6)',
      //   },
      //   {
      //     label: 'Cowpeas',
      //     data: barChartData.datasets.map((item: ProjectedFoodSourcesPeriod) => item.data[1].value),
      //     backgroundColor: () => 'rgba(248,228,165)',
      //   },
      // {
      //   label: 'Potato',
      //   data: data.map((item) => item.data.potato),
      //   backgroundColor: () => 'rgba(0, 0, 255, 0.6)',
      // },
      // {
      //   label: 'Vegetables',
      //   data: data.map((item) => item.data.vegetables),
      //   backgroundColor: () => 'rgba(172, 114, 87, 0.6)',
      // },
      // {
      //   label: 'Pigeonpeas',
      //   data: data.map((item) => item.data.pigeonpeas),
      //   backgroundColor: () => 'rgba(238, 130, 238, 0.6)',
      // },
      // {
      //   label: 'Dairy',
      //   data: data.map((item) => item.data.dairy),
      //   backgroundColor: () => 'rgba(138, 230, 238, 0.6)',
      // },
      // {
      //   label: 'Other',
      //   data: data.map((item) => item.data.other),
      //   backgroundColor: () => 'rgba(100, 181, 220, 0.6)',
      // },
      // ],
      // },
      options: {
        // animation: {
        //   onComplete(animation): void {
        //     const imageBase64 = this.toBase64Image();
        //     console.log('saving base src');
        //     this.projectedFoodSourceChartImagePNGSrc = imageBase64;
        //   setTimeout(() => {
        //     document.querySelector('#imageOfChartPNG').setAttribute('src', imageBase64);
        //     document.querySelector('#chartRenderDownloadPNGButton').setAttribute('href', imageBase64);
        //     document.querySelector('#chartRenderDownloadPNGButton').setAttribute('download', 'download.png');
        //     document.querySelector('#imageOfChartSVG').setAttribute('src', imageBase64);
        //     document.querySelector('#chartRenderDownloadSVGButton').setAttribute('href', imageBase64);
        //     document.querySelector('#chartRenderDownloadSVGButton').setAttribute('download', 'download.svg');
        //   }, 1000);
        // },
        // },
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
                labelString: 'value',
              },
            },
          ],
        },
      },
    };
  }

  //   private openDialog(): void {
  //     void this.dialogService.openDialogForComponent<ProjectionFoodSourcesDialogData>(ProjectionFoodSourcesComponent, {
  //       data: this.data,
  //       selectedTab: this.tabGroup.selectedIndex,
  //     });
  //   }
  // }

  // // eslint-disable-next-line @typescript-eslint/no-empty-interface
  // export interface ProjectionFoodSourcesDialogData {
  //   data: ProjectedFoodSourcesData;
  //   selectedTab: number;
  // }
}
