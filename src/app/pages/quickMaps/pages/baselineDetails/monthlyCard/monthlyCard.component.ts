import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MonthlyFoodGroup } from 'src/app/apiAndObjects/objects/monthlyFoodGroup';
import { MonthlyFoodGroups } from 'src/app/apiAndObjects/objects/monthlyFoodGroups';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { QuickMapsService } from '../../../quickMaps.service';
@Component({
  selector: 'app-monthly-card',
  templateUrl: './monthlyCard.component.html',
  styleUrls: ['./monthlyCard.component.scss'],
})
export class MonthlyCardComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public rawData: MonthlyFoodGroups;
  public dataSource: MatTableDataSource<MonthlyFoodGroup>;
  public chartData;

  public displayedColumns = [
    'month',
    'unitPerc',
    'vegetablesPerc',
    'cerealGrainsPerc',
    'dairyPerc',
    'fatPerc',
    'fruitPerc',
    'meatPerc',
    'tubersPerc',
    'nutsPerc',
    'miscPerc',
    'supplyTotal',
    'supplyUnit',
  ];

  constructor(
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
  ) {


    this.quickMapsService.parameterChangedObs.subscribe(() => {
      this.currentDataService.getMonthlyFoodGroups(
        this.quickMapsService.countryId,
        [this.quickMapsService.micronutrientId],
        this.quickMapsService.popGroupId,
        this.quickMapsService.mndDataId
      )
        .then((data: MonthlyFoodGroups) => {
          this.rawData = data;
        })
        .catch((err) => console.error(err))
        .finally(() => {
          this.initialiseGraph();
          this.initializeTable(this.rawData.all);
        });
    });
  }

  ngOnInit(): void {
  }

  public initialiseGraph(): void {
    this.chartData = {
      type: 'bar',
      data: {
        labels: ['Foo', 'Bar'],
        datasets: [
          { label: 'bad', data: [5, 25], backgroundColor: 'rgba(244, 143, 177, 0.6)' },
          { label: 'better', data: [15, 10], backgroundColor: 'rgba(255, 235, 59, 0.6)' },
          { label: 'good', data: [10, 8], backgroundColor: 'rgba(100, 181, 246, 0.6)' }
        ]
      },
      options: {
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [{ stacked: true }]
        }
      }
    };
  }

  public initializeTable(data: Array<MonthlyFoodGroup>): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
