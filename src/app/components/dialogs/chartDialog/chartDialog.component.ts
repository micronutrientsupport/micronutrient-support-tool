import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { MatTableObject } from 'src/app/apiAndObjects/objects/misc/matTableObject';
import { DialogData } from '../baseDialogService.abstract';
@Component({
  selector: 'app-chart-dialog',
  templateUrl: './chartDialog.component.html',
  styleUrls: ['./chartDialog.component.scss'],
})
export class ChartDialogComponent implements OnInit {

  public graphData: ChartJSObject;
  public showChart = false;
  public dataSource: MatTableDataSource<any>;
  public displayedColumns: Array<string>;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {

  }

  ngOnInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const chartData: ChartJSObject = this.dialogData.dataIn.graphData;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const tableData: MatTableObject = this.dialogData.dataIn.tableData;
    this.initialiseGraph(chartData);
    this.initialiseTable(tableData);
  }

  public initialiseGraph(chartObject: ChartJSObject): void {
    this.graphData = chartObject;
    this.showChart = true;
  }

  public initialiseTable(tableData: MatTableObject): void {
    console.debug(tableData);
    this.displayedColumns = tableData.columnIdentifiers;
    this.dataSource = new MatTableDataSource(tableData.data);

  }
}
