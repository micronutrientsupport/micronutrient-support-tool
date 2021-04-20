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
import { CurrentDataService } from 'src/app/services/currentData.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import {
  ProjectedFoodSourcesData,
  ProjectedFoodSourcesTable,
} from 'src/app/apiAndObjects/objects/projectedFoodSources';
import { ChartJSObject, ChartsJSDataObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { MiscApiService } from 'src/app/services/miscApi.service';
import { ImpactScenario } from 'src/app/apiAndObjects/objects/impactScenario';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import ColorHash from 'color-hash-ts';
import { NotificationsService } from 'src/app/components/notifications/notification.service';
@Component({
  selector: 'app-proj-food-sources ',
  templateUrl: './projectionFoodSources.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './projectionFoodSources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    private notificationService: NotificationsService,
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
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
    this.projectionFoodFormGroup.get('groupedBy').valueChanges.subscribe(() => {
      if (this.currentImpactScenario) {
        this.init();
      }
    });
    this.projectionFoodFormGroup.get('scenario').valueChanges.subscribe(() => {
      if (this.currentImpactScenario) {
        this.init();
      }
    });
    this.projectionFoodFormGroup.get('year').valueChanges.subscribe(() => {
      if (this.currentImpactScenario) {
        this.init();
      }
    });
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
              this.init();
            }),
          );
        } else if (null != this.dialogData) {
        }
      });
  }

  private init(): void {
    this.loadingSrc.next(true);
    this.currentDataService
      .getProjectedFoodSourceData(
        this.projectionFoodFormGroup.get('groupedBy').value,
        this.quickMapsService.country,
        [this.quickMapsService.micronutrient],
        this.projectionFoodFormGroup.get('scenario').value,
      )
      .then((data: Array<ProjectedFoodSourcesData>) => {
        const goodOrCommodity: string = this.projectionFoodFormGroup.get('groupedBy').value as string;

        this.data = data;
        if (null == data) {
          throw new Error('data error');
        }

        // Select current countries
        const filteredByCountry: Array<ProjectedFoodSourcesData> = data.filter(
          (item: ProjectedFoodSourcesData) => item.country === this.quickMapsService.country.id,
        );

        // Filter by current impact scenario
        const filteredByScenario: Array<ProjectedFoodSourcesData> = filteredByCountry.filter(
          (item: ProjectedFoodSourcesData) => item.scenario === this.projectionFoodFormGroup.get('scenario').value,
        );

        const filteredTableDataArray = [];
        const foodTypes = [...new Set(data.map((item) => item[goodOrCommodity]))];
        const quinquennialPeriod = [...new Set(data.map((item) => item.year))];

        // Generate the stacked chart
        const stackedChartData = {
          labels: quinquennialPeriod,
          datasets: [],
        };
        foodTypes.forEach((thing, index) => {
          stackedChartData.datasets.push({
            label: foodTypes[index],
            data: filteredByScenario
              .filter((item) => item[goodOrCommodity] === foodTypes[index])
              .map((item) => item.value),
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
                .filter((item) => item[goodOrCommodity] === foodTypes[index])
                .map((item) => item.value)[0],
            });
          });
          filteredTableDataArray.push(filteredTableData);
        });

        this.errorSrc.next(false);
        this.chartData = null;

        // remove chart before re-setting it to stop js error
        this.cdr.detectChanges();

        this.initialiseGraph(stackedChartData);
        this.initialiseTable(filteredTableDataArray, this.projectionFoodFormGroup.get('year').value);
      })
      .catch(() => this.errorSrc.next(true))
      .finally(() => {
        this.loadingSrc.next(false);
        this.cdr.detectChanges();
      });
  }

  private initialiseTable(data: Array<ProjectedFoodSourcesTable>, yearId: number): void {
    // Data needs to be flattened frmo a nested array as mat-table can't acccess nested data
    const flatten = (arr: Array<ProjectedFoodSourcesTable>) =>
      arr.reduce(
        (a: ProjectedFoodSourcesTable[], b: ProjectedFoodSourcesTable) => a.concat(Array.isArray(b) ? flatten(b) : b),
        [],
      );
    const flattenedData = flatten([data[yearId]]);
    this.dataSource = new MatTableDataSource(flattenedData);
    this.dataSource.sort = this.sort;
  }

  private initialiseGraph(stackedChartData: ChartsJSDataObject): void {
    this.chartData = {
      type: 'bar',
      data: stackedChartData,
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
