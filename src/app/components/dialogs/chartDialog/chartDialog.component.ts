import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../baseDialogService.abstract';

export interface ChartDialogData {
  // eslint-disable-next-line @typescript-eslint/ban-types
  content: object;
}

@Component({
  selector: 'app-chart-dialog',
  templateUrl: './chartDialog.component.html',
  styleUrls: ['./chartDialog.component.scss'],
})
export class ChartDialogComponent implements OnInit {
  public content = {};

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData<ChartDialogData>) {}

  ngOnInit(): void {
    this.content = this.dialogData.dataIn.content;
    // eslint-disable-next-line no-console
    // console.debug(this.content);
  }
}
