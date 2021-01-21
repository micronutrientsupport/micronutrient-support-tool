import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
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
  public chartData: ChartJSObject;

  public displayedColumns = [
    'month',
    // 'unitPerc',
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
    // 'supplyUnit',
  ];

  constructor(
    private currentDataService: CurrentDataService,
    private quickMapsService: QuickMapsService,
  ) {

    this.quickMapsService.parameterChangedObs.subscribe(() => {
      this.currentDataService
        .getMonthlyFoodGroups(
          this.quickMapsService.countryId,
          [this.quickMapsService.micronutrientId],
          this.quickMapsService.popGroupId,
          this.quickMapsService.mndDataId,
        )
        .then((data: MonthlyFoodGroups) => {
          this.rawData = data;
        })
        .catch((err) => console.error(err))
        .finally(() => {
          this.initialiseGraph(this.rawData.all);
          this.initializeTable(this.rawData.all);
        });
    });
  }

  ngOnInit(): void { }

  public initialiseGraph(data: Array<MonthlyFoodGroup>): void {
    this.chartData = {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Cereal Grains',
            data: data.map(year => year.cerealGrainsPerc),
            backgroundColor: 'rgba(255, 165, 0, 0.6)',
          },
          {
            label: 'Dairy',
            data: data.map(year => year.dairyPerc),
            backgroundColor: 'rgba(248,228,165)',
          },
          {
            label: 'Fat',
            data: data.map(year => year.fatPerc),
            backgroundColor: 'rgba(0, 0, 255, 0.6)',
          },
          {
            label: 'Nuts',
            data: data.map(year => year.nutsPerc),
            backgroundColor: 'rgba(172, 114, 87, 0.6)',
          },
          {
            label: 'Misc',
            data: data.map(year => year.miscPerc),
            backgroundColor: 'rgba(238, 130, 238, 0.6)',
          },
          {
            label: 'Fruit',
            data: data.map(year => year.fruitPerc),
            backgroundColor: 'rgba(100, 181, 220, 0.6)',
          },
          {
            label: 'Meat',
            data: data.map(year => year.meatPerc),
            backgroundColor: 'rgba(255, 0, 0, 0.6)',
          },
          {
            label: 'Tubers',
            data: data.map(year => year.tubersPerc),
            backgroundColor: 'rgba(255, 235, 59, 0.6)',
          },
          {
            label: 'Vegetables',
            data: data.map(year => year.vegetablesPerc),
            backgroundColor: 'rgba(60, 179, 113, 0.6)',
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
              barPercentage: 0.9,
              categoryPercentage: 1.0,
              scaleLabel: {
                display: true,
                labelString: 'mg',
              },
            },
          ],
        },
      },
    };
  }

  public initializeTable(data: Array<MonthlyFoodGroup>): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
