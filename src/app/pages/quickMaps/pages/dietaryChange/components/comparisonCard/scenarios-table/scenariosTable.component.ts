/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
export class ScenariosTableComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    this.sort = ms;
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  @Input() set baselineData(data: Array<MnAvailibiltyItem>) {
    if (null != data) {
      this.baselineTableData = data;
      if (null != this.scenarioTableData) {
        this.createTableObjects(this.baselineTableData, this.scenarioTableData);
      }
    }
  }

  @Input() set scenarioData(data: Array<MnAvailibiltyItem>) {
    if (null != data) {
      this.scenarioTableData = data;
      if (null != this.baselineTableData) {
        this.createTableObjects(this.baselineTableData, this.scenarioTableData);
      }
    }
  }

  public displayedColumns = ['region', 'baselineSupply', 'scenarioSupply'];
  public dataSource: MatTableDataSource<TableObject>;
  private sort: MatSort;

  private baselineTableData: Array<MnAvailibiltyItem>;
  private scenarioTableData: Array<MnAvailibiltyItem>;

  constructor() {}

  ngOnInit(): void {}

  public initialiseTable(tableData: Array<TableObject>): void {
    this.dataSource = new MatTableDataSource(tableData);
    this.dataSource.sort = this.sort;
  }

  public createTableObjects(
    baseLineDetails: Array<MnAvailibiltyItem>,
    scenarioDetails: Array<MnAvailibiltyItem>,
  ): void {
    const baselineTableObjects = new Array<TableObject>();
    const scenarioTableObjects = new Array<TableObject>();
    baseLineDetails.forEach((item) => {
      const detail: TableObject = {
        region: item.areaName,
        baselineSupply: item.dietarySupply,
      };
      baselineTableObjects.push(detail);
    });
    scenarioDetails.forEach((item) => {
      const detail: TableObject = {
        region: item.areaName,
        scenarioSupply: item.deficientValue,
      };
      scenarioTableObjects.push(detail);
    });

    const tableData = baselineTableObjects.map((baselineItem: TableObject) => ({
      ...scenarioTableObjects.find(
        (scenarioItem: TableObject) => scenarioItem.region === baselineItem.region && scenarioItem,
      ),
      ...baselineItem,
    }));

    this.initialiseTable(tableData);
  }
}
