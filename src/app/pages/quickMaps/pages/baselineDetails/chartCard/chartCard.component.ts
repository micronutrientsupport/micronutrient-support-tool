import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService } from 'src/app/components/dialogs/dialog.service';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { QuickMapsService } from '../../../quickMaps.service';
import { BinValue, HouseholdHistogramData } from 'src/app/apiAndObjects/objects/householdHistogramData';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chartCard.component.html',
  styleUrls: ['./chartCard.component.scss'],
})
export class ChartCardComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
  }

  public paginator: MatPaginator;
  public sort: MatSort;

  public bin = Array<number>();
  public frequency = Array<number>();
  public threshold: number;
  public chartData: ChartJSObject;

  public displayedColumns = ['bin', 'frequency'];

  public dataSource = new MatTableDataSource();

  constructor(
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.quickMapsService.parameterChangedObs.subscribe(() => {
      this.currentDataService
        .getHouseholdHistogramData(
          this.quickMapsService.countryId,
          [this.quickMapsService.micronutrientId],
          this.quickMapsService.popGroupId,
          this.quickMapsService.mndDataId,
        )
        .then((data: Array<HouseholdHistogramData>) => {
          if (null != data) {
            const rawData = data[0].data;
            this.threshold = Number(data[0].adequacyThreshold);

            rawData.forEach((item: BinValue) => {
              this.bin.push(item.bin);
              this.frequency.push(item.frequency);
            });

            this.initialiseGraph();
            this.initialiseTable(rawData);
          }
        })
        .catch((err) => console.error(err));
    });

  }

  public openDialog(): void {
    void this.dialogService.openChartDialog(this.chartData);
  }

  public initialiseGraph(): void {
    this.chartData = {
      plugins: [ChartAnnotation],
      type: 'bar',
      data: {
        labels: this.bin,
        datasets: [
          {
            label: 'Frequency',
            data: this.frequency,
            borderColor: '#ff6384',
            backgroundColor: '#ff6384',
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
              value: this.threshold, // data-value at which the line is drawn
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

  public initialiseTable(data: Array<any>): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
