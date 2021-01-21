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
          this.initialiseGraph();
          this.initializeTable(this.rawData.all);
        });
    });
  }

  ngOnInit(): void { }

  public initialiseGraph(): void {
    this.chartData = {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Cereal Grains',
            data: [
              this.rawData.jan.cerealGrainsPerc,
              this.rawData.feb.cerealGrainsPerc,
              this.rawData.mar.cerealGrainsPerc,
              this.rawData.apr.cerealGrainsPerc,
              this.rawData.may.cerealGrainsPerc,
              this.rawData.jun.cerealGrainsPerc,
              this.rawData.jul.cerealGrainsPerc,
              this.rawData.aug.cerealGrainsPerc,
              this.rawData.sep.cerealGrainsPerc,
              this.rawData.oct.cerealGrainsPerc,
              this.rawData.nov.cerealGrainsPerc,
              this.rawData.dec.cerealGrainsPerc,
            ],
            backgroundColor: 'rgba(255, 165, 0, 0.6)',
          },
          {
            label: 'Dairy',
            data: [
              this.rawData.jan.dairyPerc,
              this.rawData.feb.dairyPerc,
              this.rawData.mar.dairyPerc,
              this.rawData.apr.dairyPerc,
              this.rawData.may.dairyPerc,
              this.rawData.jun.dairyPerc,
              this.rawData.jul.dairyPerc,
              this.rawData.aug.dairyPerc,
              this.rawData.sep.dairyPerc,
              this.rawData.oct.dairyPerc,
              this.rawData.nov.dairyPerc,
              this.rawData.dec.dairyPerc,
            ],
            backgroundColor: 'rgba(248,228,165)',
          },
          {
            label: 'Fat',
            data: [
              this.rawData.jan.fatPerc,
              this.rawData.feb.fatPerc,
              this.rawData.mar.fatPerc,
              this.rawData.apr.fatPerc,
              this.rawData.may.fatPerc,
              this.rawData.jun.fatPerc,
              this.rawData.jul.fatPerc,
              this.rawData.aug.fatPerc,
              this.rawData.sep.fatPerc,
              this.rawData.oct.fatPerc,
              this.rawData.nov.fatPerc,
              this.rawData.dec.fatPerc,
            ],
            backgroundColor: 'rgba(0, 0, 255, 0.6)',
          },
          {
            label: 'Nuts',
            data: [
              this.rawData.jan.nutsPerc,
              this.rawData.feb.nutsPerc,
              this.rawData.mar.nutsPerc,
              this.rawData.apr.nutsPerc,
              this.rawData.may.nutsPerc,
              this.rawData.jun.nutsPerc,
              this.rawData.jul.nutsPerc,
              this.rawData.aug.nutsPerc,
              this.rawData.sep.nutsPerc,
              this.rawData.oct.nutsPerc,
              this.rawData.nov.nutsPerc,
              this.rawData.dec.nutsPerc,
            ],
            backgroundColor: 'rgba(172, 114, 87, 0.6)',
          },
          {
            label: 'Misc',
            data: [
              this.rawData.jan.miscPerc,
              this.rawData.feb.miscPerc,
              this.rawData.mar.miscPerc,
              this.rawData.apr.miscPerc,
              this.rawData.may.miscPerc,
              this.rawData.jun.miscPerc,
              this.rawData.jul.miscPerc,
              this.rawData.aug.miscPerc,
              this.rawData.sep.miscPerc,
              this.rawData.oct.miscPerc,
              this.rawData.nov.miscPerc,
              this.rawData.dec.miscPerc,
            ],
            backgroundColor: 'rgba(238, 130, 238, 0.6)',
          },
          {
            label: 'Fruit',
            data: [
              this.rawData.jan.fruitPerc,
              this.rawData.feb.fruitPerc,
              this.rawData.mar.fruitPerc,
              this.rawData.apr.fruitPerc,
              this.rawData.may.fruitPerc,
              this.rawData.jun.fruitPerc,
              this.rawData.jul.fruitPerc,
              this.rawData.aug.fruitPerc,
              this.rawData.sep.fruitPerc,
              this.rawData.oct.fruitPerc,
              this.rawData.nov.fruitPerc,
              this.rawData.dec.fruitPerc,
            ],
            backgroundColor: 'rgba(100, 181, 220, 0.6)',
          },
          {
            label: 'Meat',
            data: [
              this.rawData.jan.meatPerc,
              this.rawData.feb.meatPerc,
              this.rawData.mar.meatPerc,
              this.rawData.apr.meatPerc,
              this.rawData.may.meatPerc,
              this.rawData.jun.meatPerc,
              this.rawData.jul.meatPerc,
              this.rawData.aug.meatPerc,
              this.rawData.sep.meatPerc,
              this.rawData.oct.meatPerc,
              this.rawData.nov.meatPerc,
              this.rawData.dec.meatPerc,
            ],
            backgroundColor: 'rgba(255, 0, 0, 0.6)',
          },
          {
            label: 'Tubers',
            data: [
              this.rawData.jan.tubersPerc,
              this.rawData.feb.tubersPerc,
              this.rawData.mar.tubersPerc,
              this.rawData.apr.tubersPerc,
              this.rawData.may.tubersPerc,
              this.rawData.jun.tubersPerc,
              this.rawData.jul.tubersPerc,
              this.rawData.aug.tubersPerc,
              this.rawData.sep.tubersPerc,
              this.rawData.oct.tubersPerc,
              this.rawData.nov.tubersPerc,
              this.rawData.dec.tubersPerc,
            ],
            backgroundColor: 'rgba(255, 235, 59, 0.6)',
          },
          {
            label: 'Vegetables',
            data: [
              this.rawData.jan.vegetablesPerc,
              this.rawData.feb.vegetablesPerc,
              this.rawData.mar.vegetablesPerc,
              this.rawData.apr.vegetablesPerc,
              this.rawData.may.vegetablesPerc,
              this.rawData.jun.vegetablesPerc,
              this.rawData.jul.vegetablesPerc,
              this.rawData.aug.vegetablesPerc,
              this.rawData.sep.vegetablesPerc,
              this.rawData.oct.vegetablesPerc,
              this.rawData.nov.vegetablesPerc,
              this.rawData.dec.vegetablesPerc,
            ],
            backgroundColor: 'rgba(60, 179, 113, 0.6)',
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              stacked: true,
              scaleLabel: {
                display: true,
                labelString: 'Percentage in mg',
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              barPercentage: 0.9,
              categoryPercentage: 1.0,
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
