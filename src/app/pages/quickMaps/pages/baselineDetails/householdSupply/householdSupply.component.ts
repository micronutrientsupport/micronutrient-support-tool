import {
  Component,
  ViewChild,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  Inject,
  Optional,
  AfterViewInit,
} from '@angular/core';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { QuickMapsService } from '../../../quickMaps.service';
import { BinValue, HouseholdHistogramData } from 'src/app/apiAndObjects/objects/householdHistogramData';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CardComponent } from 'src/app/components/card/card.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { MatTabGroup } from '@angular/material/tabs';
@Component({
  selector: 'app-household-supply',
  templateUrl: './householdSupply.component.html',
  styleUrls: [
    '../../expandableTabGroup.scss',
    './householdSupply.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HouseholdSupplyComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort: MatSort;

  @Input() card: CardComponent;

  public title = 'Household Dietary Supply';

  public chartData: ChartJSObject;
  public displayedColumns = ['bin', 'frequency'];
  public dataSource = new MatTableDataSource();

  private data: HouseholdHistogramData;

  private loadingSrc = new BehaviorSubject<boolean>(false);
  private errorSrc = new BehaviorSubject<boolean>(false);

  private subscriptions = new Array<Subscription>();

  constructor(
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: DialogData<HouseholdSupplyDialogData>,
  ) { }

  ngAfterViewInit(): void {
    if (null != this.card) {
      // if displayed within a card component init interactions with the card
      this.card.title = this.title;
      this.card.showExpand = true;
      this.card
        .setLoadingObservable(this.loadingSrc.asObservable())
        .setErrorObservable(this.errorSrc.asObservable());

      this.subscriptions.push(
        this.card.onExpandClickObs.subscribe(() => this.openDialog())
      );

      // respond to parameter updates
      this.subscriptions.push(
        this.quickMapsService.parameterChangedObs.subscribe(() => {
          this.init(this.currentDataService.getHouseholdHistogramData(
            this.quickMapsService.country,
            [this.quickMapsService.micronutrient],
            this.quickMapsService.mndDataOption,
          ));
        })
      );
    } else if (null != this.dialogData) {
      // if displayed within a dialog use the data passed in
      this.init(Promise.resolve(this.dialogData.dataIn.data));
      this.tabGroup.selectedIndex = this.dialogData.dataIn.selectedTab;
      this.cdr.detectChanges();
    }
  }

  private init(dataPromise: Promise<HouseholdHistogramData>): void {
    this.loadingSrc.next(true);
    dataPromise
      .then((data: HouseholdHistogramData) => {
        this.data = data;
        if (null == data) {
          throw new Error('data error');
        }

        this.dataSource = new MatTableDataSource(data.data);
        this.errorSrc.next(false);
        this.chartData = null;
        // force change detection to:
        // remove chart before re-setting it to stop js error
        // show table and init paginator and sorter
        this.cdr.detectChanges();

        this.dataSource.sort = this.sort;

        this.initialiseGraph(data);
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

  private initialiseGraph(data: HouseholdHistogramData): void {
    this.chartData = {
      plugins: [ChartAnnotation],
      type: 'bar',
      data: {
        labels: data.data.map((item: BinValue) => item.bin),
        datasets: [
          {
            label: 'Frequency',
            data: data.data.map((item: BinValue) => item.frequency),
            borderColor: '#ff6384',
            backgroundColor: () => '#ff6384',
            fill: true,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: true,
        },
        scales: {
          xAxes: [
            {
              display: true,
            },
          ],
          yAxes: [
            {
              display: true,
              id: 'y-axis-0',
            },
          ],
        },
        annotation: {
          annotations: [
            {
              type: 'line',
              id: 'hLine',
              mode: 'horizontal',
              scaleID: 'y-axis-0',
              value: Number(data.adequacyThreshold), // data-value at which the line is drawn
              borderWidth: 2.5,
              borderColor: 'black',
              label: {
                enabled: true,
                content: 'Threshold',
              },
            },
          ],
        },
      },
    };
  }

  private openDialog(): void {
    void this.dialogService.openDialogForComponent<HouseholdSupplyDialogData>(HouseholdSupplyComponent, {
      data: this.data,
      selectedTab: this.tabGroup.selectedIndex,
    });
  }
}

export interface HouseholdSupplyDialogData {
  data: HouseholdHistogramData;
  selectedTab: number;
}
