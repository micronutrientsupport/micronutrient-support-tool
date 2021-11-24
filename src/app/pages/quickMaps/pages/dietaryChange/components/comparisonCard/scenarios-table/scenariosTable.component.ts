import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MnAvailibiltyItem } from 'src/app/apiAndObjects/objects/mnAvailibilityItem.abstract';

interface TableObject {
  region: string;
  baselineSupply?: number;
  scenarioSupply?: number;
}

@Component({
  selector: 'app-scenarios-table',
  templateUrl: './scenariosTable.component.html',
  styleUrls: ['../../../../expandableTabGroup.scss', './scenariosTable.component.scss'],
})
export class ScenariosTableComponent implements AfterViewInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input() set baselineData(data: Array<MnAvailibiltyItem>) {
    this.baselineAvailabilityData = data;
    this.refreshTableObjects();
  }

  @Input() set scenarioData(data: Array<MnAvailibiltyItem>) {
    this.scenarioAvailabilityData = data;
    this.refreshTableObjects();
  }

  public displayedColumns = ['region', 'baselineSupply', 'scenarioSupply'];
  public dataSource = new MatTableDataSource<TableObject>();

  private baselineAvailabilityData: Array<MnAvailibiltyItem>;
  private scenarioAvailabilityData: Array<MnAvailibiltyItem>;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  private refreshTableObjects(): void {
    const tableObjects = new Array<TableObject>();
    if (null != this.baselineAvailabilityData && null != this.scenarioAvailabilityData) {
      this.baselineAvailabilityData.forEach((baselineItem) => {
        const scenarioItem = this.scenarioAvailabilityData.find((item) => item.areaId === baselineItem.areaId);
        const detail: TableObject = {
          region: baselineItem.areaName,
          baselineSupply: baselineItem.dietarySupply,
          scenarioSupply: null == scenarioItem ? null : scenarioItem.dietarySupply,
        };
        tableObjects.push(detail);
      });
    }
    this.dataSource.data = tableObjects;
  }
}
