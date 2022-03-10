import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-mn-addition-dialog',
  templateUrl: './mnAdditionDialog.component.html',
  styleUrls: ['./mnAdditionDialog.component.scss'],
})
export class MnAdditionDialogComponent implements OnInit {
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {
    //add content
  }

  ngOnInit(): void {
    //add content
  }
  public closeDialog(): void {
    this.dialog.closeAll();
  }

  public addMN(): void {
    //add additional micronutrient
    //
    this.dialog.closeAll();
  }
}
