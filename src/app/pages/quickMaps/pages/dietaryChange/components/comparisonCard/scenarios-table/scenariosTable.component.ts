/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SubRegionDataItem } from 'src/app/apiAndObjects/objects/subRegionDataItem';

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

  @Input() set baselineData(data: SubRegionDataItem) {
    if (null != data) {
      this.baselineTableData = data;
      if (null != this.scenarioTableData) {
        this.createTableObjects(this.baselineTableData, this.scenarioTableData);
      }
    }
  }

  @Input() set scenarioData(data: SubRegionDataItem) {
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

  private baselineTableData: SubRegionDataItem;
  private scenarioTableData: SubRegionDataItem;

  constructor() {}

  ngOnInit(): void {}

  public initialiseTable(tableData: Array<TableObject>): void {
    this.dataSource = new MatTableDataSource(tableData);
    this.dataSource.sort = this.sort;
  }

  public createTableObjects(baseLineDetails: SubRegionDataItem, scenarioDetails: SubRegionDataItem): void {
    const baselineTableObjects = new Array<TableObject>();
    const scenarioTableObjects = new Array<TableObject>();
    baseLineDetails.geoJson.features.forEach((item) => {
      const detail: TableObject = {
        region: item.properties.subregion_name,
        baselineSupply: item.properties.mn_absolute,
      };
      baselineTableObjects.push(detail);
    });
    scenarioDetails.geoJson.features.forEach((item) => {
      const detail: TableObject = {
        region: item.properties.subregion_name,
        scenarioSupply: item.properties.mn_absolute,
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
