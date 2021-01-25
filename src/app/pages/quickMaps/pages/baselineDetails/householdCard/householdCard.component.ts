/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectorRef,
} from '@angular/core';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GridsterItem } from 'angular-gridster2';
import { Subscription } from 'rxjs';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { QuickMapsService } from '../../../quickMaps.service';
import { BinValue, HouseholdHistogramData } from 'src/app/apiAndObjects/objects/householdHistogramData';
@Component({
  selector: 'app-household-card',
  templateUrl: './householdCard.component.html',
  styleUrls: ['./householdCard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HouseholdCardComponent implements OnInit, OnDestroy {
  @Input()
  widget;
  @Input()
  resizeEvent: EventEmitter<GridsterItem>;

  resizeSub: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public loading = false;
  public error = false;

  public chartData: ChartJSObject;

  public displayedColumns = ['bin', 'frequency'];

  public dataSource = new MatTableDataSource();

  constructor(
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.resizeSub = this.resizeEvent.subscribe((widget) => {
      if (widget === this.widget) {
        // or check id , type or whatever you have there
        // resize your widget, chart, map , etc.
        // console.log(widget);
      }
    });
    this.quickMapsService.parameterChangedObs.subscribe(() => {
      this.loading = true;
      this.currentDataService
        .getHouseholdHistogramData(
          this.quickMapsService.countryId,
          [this.quickMapsService.micronutrientId],
          this.quickMapsService.popGroupId,
          this.quickMapsService.mndDataId,
        )
        .then((data: Array<HouseholdHistogramData>) => {
          if (null == data) {
            throw new Error('data error');
          }
          const rawData = data[0].data;

          this.dataSource = new MatTableDataSource(rawData);
          this.error = false;
          this.chartData = null;
          // force change detection to:
          // remove chart before re-setting it to stop js error
          // show table and init paginator and sorter
          this.cdr.detectChanges();

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.initialiseGraph(data);
        })
        .catch((err) => {
          this.error = true;
          console.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    });
  }

  ngOnDestroy(): void {
    this.resizeSub.unsubscribe();
  }

  public initialiseGraph(data: Array<HouseholdHistogramData>): void {
    this.chartData = {
      plugins: [ChartAnnotation],
      type: 'bar',
      data: {
        labels: data[0].data.map((item: BinValue) => item.bin),
        datasets: [
          {
            label: 'Frequency',
            data: data[0].data.map((item: BinValue) => item.frequency),
            borderColor: '#ff6384',
            backgroundColor: () => '#ff6384',
            fill: true,
          },
        ],
      },
      options: {
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
              value: Number(data[0].adequacyThreshold), // data-value at which the line is drawn
              borderWidth: 2.5,
              borderColor: () => 'black',
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

  public openDialog(): void {
    void this.dialogService.openChartDialog(this.chartData);
  }
}
