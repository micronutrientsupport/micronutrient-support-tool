import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { MatTableObject } from 'src/app/apiAndObjects/objects/misc/matTableObject';
import { DialogData } from '../baseDialogService.abstract';

export interface CardExpandDialogData {
  graphData: ChartJSObject;
  tableData: MatTableObject;
}
@Component({
  selector: 'app-expand-dialog',
  templateUrl: './expandDialog.component.html',
  styleUrls: ['./expandDialog.component.scss'],
})
export class ExpandDialogComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
  }

  public graphData: ChartJSObject;
  public paginator: MatPaginator;
  public sort: MatSort;

  public showChart = false;
  public dataSource: MatTableDataSource<any>;
  public displayedColumns: Array<string>;
  private filterTimeout: NodeJS.Timeout;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData<CardExpandDialogData>) {
  }

  ngOnInit(): void {
    const chartData: ChartJSObject = this.data.dataIn.graphData;
    const tableData: MatTableObject = this.data.dataIn.tableData;
    this.initialiseGraph(chartData);
    this.initialiseTable(tableData);
  }

  public initialiseGraph(chartObject: ChartJSObject): void {
    this.graphData = chartObject;
    this.showChart = true;
  }

  public initialiseTable(tableData: MatTableObject): void {
    this.displayedColumns = tableData.columnIdentifiers;
    this.dataSource = tableData.datasource;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public applyFilter(event: KeyboardEvent): void {
    // only filter after the filter hasn't changed for delay
    clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(() => {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }, 100);
  }
}
