import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChartJSObject } from 'src/app/apiAndObjects/objects/misc/chartjsObject';
import { DialogData } from '../baseDialogService.abstract';
@Component({
  selector: 'app-chart-dialog',
  templateUrl: './chartDialog.component.html',
  styleUrls: ['./chartDialog.component.scss'],
})
export class ChartDialogComponent implements OnInit {

  public graphData: ChartJSObject;
  public showChart = false;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData<ChartJSObject>) {

  }

  ngOnInit(): void {
    const chartData: ChartJSObject = this.dialogData.dataIn;
    this.initialiseGraph(chartData);
  }

  public initialiseGraph(chartObject: ChartJSObject): void {
    this.graphData = chartObject;
    this.showChart = true;
  }
}
