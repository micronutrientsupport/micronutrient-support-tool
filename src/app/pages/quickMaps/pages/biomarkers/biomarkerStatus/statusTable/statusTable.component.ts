import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BiomarkerCharacteristicType, BiomarkerDataType, BiomarkerStatusData } from '../biomarkerStatus.component';

interface TableObject {
  region: string;
  n: number;
  deficient: string;
  confidence: string;
}
@Component({
  selector: 'app-status-table',
  templateUrl: './statusTable.component.html',
  styleUrls: ['./statusTable.component.scss'],
})
export class StatusTableComponent {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() set biomarkerData(data: Array<BiomarkerStatusData>) {
    if (null != data) {
      this.generateTable(data);
    }
  }

  @Input() set selectedDataType(dataType: BiomarkerDataType) {
    if (null != dataType) {
      // set table with new data type.
    }
  }

  @Input() set selectedCharacteristicType(dataType: BiomarkerCharacteristicType) {
    if (null != dataType) {
      // set table with new charateristic type.
    }
  }

  public displayedColumns = ['region', 'n', 'deficient', 'confidence'];
  public dataSource: MatTableDataSource<TableObject>;
  public totalSamples: number;

  private generateTable(data: Array<BiomarkerStatusData>) {
    const n = data.length;
    const dataArray = new Array<TableObject>();

    this.totalSamples = n;

    data.forEach((item: BiomarkerStatusData) => {
      const tableObject: TableObject = {
        region: item.areaName,
        n: n,
        deficient: item.mineralLevelOne,
        confidence: item.mineralOutlier,
      };
      dataArray.push(tableObject);
    });

    this.dataSource = new MatTableDataSource(dataArray);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
