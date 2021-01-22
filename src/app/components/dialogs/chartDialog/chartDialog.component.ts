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
    // setTimeout(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const chartData: ChartJSObject = this.dialogData.dataIn;
    this.initialiseGraph(chartData);
    // }, 1000);
  }

  public initialiseGraph(chartObject: ChartJSObject): void {
    // this.graphData = {} as ChartJSObject;
    this.graphData = chartObject;
    // this.graphData.type = chartObject.type;
    // this.graphData.options = chartObject.options;
    // this.graphData.legend = chartObject.legend;
    this.showChart = true;
    console.debug(chartObject);
  }
}
