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
@Component({
  selector: 'app-proj-avail',
  templateUrl: './projectionAvailability.component.html',
  styleUrls: ['../../expandableTabGroup.scss', './projectionAvailability.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectionAvailabilityComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort: MatSort;
  @Input() card: CardComponent;

  public title = 'Projection Availability';
  public headingText = 'Calcium';
  public subtHeadingText = '';
  public selectedCountry: string;

  public dataSource: MatTableDataSource<ProjectedAvailability>;

  public displayedColumns: string[] = [
    'country',
    'year',
    'scenario',
    'ca',
    'caDiff',
    'b9',
    'b9Diff',
    'fe',
    'feDiff',
    'mg',
    'mgDiff',
    'b3',
    'b3Diff',
    'p',
    'pDiff',
    'k',
    'kDiff',
    'protein',
    'proteinDiff',
    'b2',
    'b2Diff',
    'b1',
    'b1Diff',
    'a',
    'aDiff',
    'b6',
    'b6Diff',
    'c',
    'cDiff',
    'zn',
    'znDiff',
  ];

  public chartData: ChartJSObject;

  private data: Array<ProjectedAvailability>;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  constructor(
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<ProjectionAvailabilityDialogData>,
  ) {}

  ngAfterViewInit(): void {
    // if displayed within a card component init interactions with the card
    if (null != this.card) {
      this.card.title = this.title;
      this.card.showExpand = true;
      this.card.setLoadingObservable(this.loadingSrc.asObservable()).setErrorObservable(this.errorSrc.asObservable());

      this.subscriptions.push(this.card.onExpandClickObs.subscribe(() => this.openDialog()));

      // respond to parameter updates
      this.quickMapsService.countryIdObs.subscribe((id: string) => (this.selectedCountry = id));
      this.subscriptions.push(
        this.quickMapsService.parameterChangedObs.subscribe(() => {
          this.init(
            this.currentDataService.getProjectedAvailabilities(
              this.quickMapsService.countryId,
              [this.quickMapsService.micronutrient],
              this.quickMapsService.mndDataOption,
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

  private init(dataPromise: Promise<Array<ProjectedAvailability>>): void {
    this.loadingSrc.next(true);
    dataPromise
      .then((data: Array<ProjectedAvailability>) => {
        this.data = data;
        if (null == data) {
          throw new Error('data error');
        }

        const filteredData: Array<ProjectedAvailability> = data.filter(
          (item: ProjectedAvailability) => item.country === this.selectedCountry,
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
      .catch((err) => {
        this.errorSrc.next(true);
        console.error(err);
      })
      .finally(() => {
        this.loadingSrc.next(false);
        this.cdr.detectChanges();
      });
  }

  private initialiseTable(data: Array<ProjectedAvailability>): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }

  private initialiseGraph(data: Array<ProjectedAvailability>): void {
    this.chartData = {
      type: 'line',
      data: {
        labels: data.filter((item) => item.scenario === 'SSP1').map((item) => item.year),
        datasets: [
          {
            label: 'SSP1',
            data: data.filter((item) => item.scenario === 'SSP1').map((item) => item.c),
            backgroundColor: () => 'rgba(12, 92, 90, 0.6)',
          },
          {
            label: 'SSP2',
            data: data.filter((item) => item.scenario === 'SSP2').map((item) => item.c),
            backgroundColor: () => 'rgba(12, 92, 225, 0.6)',
          },
          {
            label: 'SSP3',
            data: data.filter((item) => item.scenario === 'SSP3').map((item) => item.c),
            backgroundColor: () => 'rgba(48, 102, 133, 0.6)',
          },
        ],
      },
      options: {
        scales: {
          xAxes: [{}],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'MN availability in mg/ per Person per Day',
              },
            },
          ],
        },
      },
    };
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
