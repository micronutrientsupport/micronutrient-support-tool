import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SimpleAggregationThreshold } from '../biomarkerStatus.component';
import { QuickMapsService } from 'src/app/pages/quickMaps/quickMaps.service';

interface TableObject {
  aggregation: string;
  confidenceIntervalLower: number;
  confidenceIntervalUpper: number;
  x: number;
}
@Component({
  selector: 'app-status-table',
  templateUrl: './statusTable.component.html',
  styleUrls: ['./statusTable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusTableComponent implements OnChanges {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input()
  set aggregationThresholdData(data: SimpleAggregationThreshold) {
    if (data) {
      this.generateTable(data);
    }
  }

  @Input() biomarkerDataUpdating: boolean;

  public displayedColumns = ['aggregation', 'x', 'confidenceIntervalLower', 'confidenceIntervalUpper'];
  public dataSource: MatTableDataSource<TableObject>;
  public totalSamples: number;
  public columnX = '';

  constructor(public quickMapsService: QuickMapsService) {}

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
  }

  private generateTable(data: SimpleAggregationThreshold) {
    this.totalSamples = data.value.length;
    const dataArray = new Array<TableObject>();

    data.value.forEach((item: object) => {
      const tableObject: TableObject = {
        aggregation: item['aggregation'],
        confidenceIntervalLower: item['confidenceIntervalLower'],
        confidenceIntervalUpper: item['confidenceIntervalUpper'],
        x: item[data.key],
      };
      dataArray.push(tableObject);
    });
    this.columnX = data.key;
    this.dataSource = new MatTableDataSource(dataArray);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
