import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PopulationGroup } from 'src/app/apiAndObjects/objects/populationGroup';
import { TopFoodSource } from 'src/app/apiAndObjects/objects/topFoodSource';
import { Dictionary } from 'src/app/apiAndObjects/_lib_code/objects/dictionary';
import { CurrentDataService } from 'src/app/services/currentData.service';
import { QuickMapsService } from '../../../quickMaps.service';
import 'chartjs-chart-treemap';
import { ChartData, ChartDataSets, ChartPoint, ChartTooltipCallback, ChartTooltipItem } from 'chart.js';
@Component({
  selector: 'app-food-items',
  templateUrl: './foodItems.component.html',
  styleUrls: ['./foodItems.component.scss'],
})
export class FoodItemsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public countriesDictionary: Dictionary;
  public regionDictionary: Dictionary;
  public micronutrientsDictionary: Dictionary;
  public popGroupOptions = new Array<PopulationGroup>();
  public chartData;
  public displayedColumns = ['name', 'value'];
  public dataSource = new MatTableDataSource();

  constructor(private currentDataService: CurrentDataService, private quickMapsService: QuickMapsService) {}

  ngOnInit(): void {
    void this.currentDataService
      .getTopFood(
        this.quickMapsService.countryDict,
        this.quickMapsService.micronutrientDict,
        this.quickMapsService.popGroupId,
        // this.quickMapsService.mndDataIdObs,
      )
      .then((foodData: Array<TopFoodSource>) => {
        this.dataSource = new MatTableDataSource(foodData);
        this.initTreemap(foodData);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  public initTreemap(data: Array<TopFoodSource>): void {
    this.chartData = {
      type: 'treemap',
      data: {
        datasets: [
          {
            tree: data,
            key: 'value',
            groups: ['foodex2Name'],
            groupLabels: true,
            fontColor: '#ffffff',
            fontFamily: 'Quicksand',
            fontSize: 14,
            fontStyle: 'normal',
            // random shade of color palette purple
            backgroundColor: (): string => 'hsl(271, 70%, ' + Math.floor(Math.random() * (70 - 10 + 1) + 10) + '%)',
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            title: (): string => 'Food Item',
            label: (item: ChartTooltipItem, result: ChartData): string => {
              const dataset: ChartDataSets = result.datasets[item.datasetIndex];
              const dataItem: number | number[] | ChartPoint = dataset.data[item.index];
              console.log('item: ', dataset);
              console.log('result: ', dataItem);
              // const obj = dataItem;
              // const label = obj.foodex2Name;
              return 'test';
              // return label + ': ' + dataItem.v;
            },
          },
        },
      },
    };
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
