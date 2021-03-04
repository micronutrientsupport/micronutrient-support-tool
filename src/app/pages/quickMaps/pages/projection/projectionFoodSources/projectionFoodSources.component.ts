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
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import {
  ProjectedFoodSourceItem,
  ProjectedFoodSourcesData,
  ProjectedFoodSourcesPeriod,
  ProjectedFoodSourcesTable,
} from 'src/app/apiAndObjects/objects/projectedFoodSources';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { MiscApiService } from 'src/app/services/miscApi.service';
import { ImpactScenario } from 'src/app/apiAndObjects/objects/impactScenario';
import { isNgTemplate } from '@angular/compiler';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  public title = 'Projection Food Sources for Calcium';

  public chartData: ChartJSObject;
  public displayedColumns = ['foodName', 'value'];
  public dataSource = new MatTableDataSource();
  private sort: MatSort;
  private data: Array<ProjectedFoodSourcesData>;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();
  public selectedCountry: string;
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
    { id: '2005', name: '2005' },
    { id: '2010', name: '2010' },
    { id: '2015', name: '2015' },
    { id: '2020', name: '2020' },
    { id: '2025', name: '2025' },
    { id: '2030', name: '2030' },
    { id: '2035', name: '2035' },
    { id: '2040', name: '2040' },
    { id: '2045', name: '2045' },
    { id: '2050', name: '2050' },
  ];

  constructor(
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
    private dialogService: DialogService,
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
    this.projectionFoodFormGroup.get('groupedBy').valueChanges.subscribe((value: string) => {
      // change
    });
    this.projectionFoodFormGroup.get('scenario').valueChanges.subscribe((value: string) => {
      // change
    });
    this.projectionFoodFormGroup.get('year').valueChanges.subscribe((value: string) => {
      // change
    });
  }

  ngOnInit(): void {}
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
        // if displayed within a card component init interactions with the card
        if (null != this.card) {
          this.card.title = this.title;
          this.card.showExpand = true;
          this.card
            .setLoadingObservable(this.loadingSrc.asObservable())
            .setErrorObservable(this.errorSrc.asObservable());

          // this.subscriptions.push(this.card.onExpandClickObs.subscribe(() => this.openDialog()));

          // respond to parameter updates
          this.quickMapsService.countryIdObs.subscribe((id: string) => (this.selectedCountry = id));
          this.subscriptions.push(
            this.quickMapsService.parameterChangedObs.subscribe(() => {
              this.init(
                this.currentDataService.getProjectedFoodSourceData(
                  this.quickMapsService.countryId,
                  [this.quickMapsService.micronutrientId],
                  this.quickMapsService.popGroupId,
                  this.quickMapsService.mndDataId,
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
          (item: ProjectedFoodSourcesData) => item.country === this.selectedCountry,
        );

        // Filter by current impact scenario
        const filteredByScenario: Array<ProjectedFoodSourcesData> = filteredByCountry.filter(
          (item: ProjectedFoodSourcesData) => item.scenario === this.currentImpactScenario.name,
        );

        // Filter by year and populate the array of objects
        const filteredData = new Array<ProjectedFoodSourcesPeriod>();
        const filteredTableDataArray = [];

        const quinquennialPeriod = [...new Set(data.map((item) => item.year))];
        quinquennialPeriod.forEach((currentYear) => {
          const filteredTableData = new Array<ProjectedFoodSourcesTable>();

          // Populate data for chart.js
          filteredData.push({
            year: currentYear,
            data: {
              cassava: filteredByScenario
                .filter((item) => item.year === currentYear)
                .filter((item) => item.commodity === 'Cassava')
                .map((item) => item.value)[0],
              maize: filteredByScenario
                .filter((item) => item.year === currentYear)
                .filter((item) => item.commodity === 'Maize')
                .map((item) => item.value)[0],
              potato: filteredByScenario
                .filter((item) => item.year === currentYear)
                .filter((item) => item.commodity === 'Potato')
                .map((item) => item.value)[0],
              vegetables: filteredByScenario
                .filter((item) => item.year === currentYear)
                .filter((item) => item.commodity === 'Vegetables')
                .map((item) => item.value)[0],
              pigeonpeas: filteredByScenario
                .filter((item) => item.year === currentYear)
                .filter((item) => item.commodity === 'Pigeonpeas')
                .map((item) => item.value)[0],
              dairy: filteredByScenario
                .filter((item) => item.year === currentYear)
                .filter((item) => item.commodity === 'Dairy')
                .map((item) => item.value)[0],
              other: filteredByScenario
                .filter((item) => item.year === currentYear)
                .filter((item) => item.commodity === 'Other')
                .map((item) => item.value)[0],
            },
          });

          //  Populate data for Tablet
          const foodTypes = [...new Set(data.map((item) => item.commodity))];

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
        this.initialiseGraph(filteredData);

        // show table and init paginator and sorter
        this.initialiseTable(filteredTableDataArray);
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

  private initialiseTable(data: Array<ProjectedFoodSourcesTable>): void {
    const flatten = (arr) =>
      arr.reduce((a, b) => {
        return a.concat(Array.isArray(b) ? flatten(b) : b);
      }, []);
    const flattenedData = flatten([data[0]]);
    console.log('Updating Table Data');
    this.dataSource = new MatTableDataSource(flattenedData);
    this.dataSource.sort = this.sort;
  }

  private initialiseGraph(data: Array<ProjectedFoodSourcesPeriod>): void {
    const quinquennialPeriod = [...new Set(data.map((item) => item.year))];

    this.chartData = {
      type: 'bar',
      data: {
        labels: quinquennialPeriod,
        datasets: [
          {
            label: 'Cassava',
            data: data.map((item) => item.data.cassava),
            backgroundColor: () => 'rgba(255, 165, 0, 0.6)',
          },
          {
            label: 'Maize',
            data: data.map((item) => item.data.maize),
            backgroundColor: () => 'rgba(248,228,165)',
          },
          {
            label: 'Potato',
            data: data.map((item) => item.data.potato),
            backgroundColor: () => 'rgba(0, 0, 255, 0.6)',
          },
          {
            label: 'Vegetables',
            data: data.map((item) => item.data.vegetables),
            backgroundColor: () => 'rgba(172, 114, 87, 0.6)',
          },
          {
            label: 'Pigeonpeas',
            data: data.map((item) => item.data.pigeonpeas),
            backgroundColor: () => 'rgba(238, 130, 238, 0.6)',
          },
          {
            label: 'Dairy',
            data: data.map((item) => item.data.dairy),
            backgroundColor: () => 'rgba(138, 230, 238, 0.6)',
          },
          {
            label: 'Other',
            data: data.map((item) => item.data.other),
            backgroundColor: () => 'rgba(100, 181, 220, 0.6)',
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
