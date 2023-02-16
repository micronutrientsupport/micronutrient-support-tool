import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InterventionMonitoringInformation } from 'src/app/apiAndObjects/objects/interventionMonitoringInformation';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-ce-reset-dialog',
  templateUrl: './ceResetDialog.component.html',
  styleUrls: ['./ceResetDialog.component.scss'],
})
export class CeResetDialogComponent implements OnInit {
  public monitoringInformation: InterventionMonitoringInformation;
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {
    //add content
  }

  ngOnInit(): void {
    //add content
  }
  public closeDialog(): void {
    this.dialogData.dataOut = false;
    this.dialogData.close();
  }

  public resetAll(): void {
    //reset all needes to only reset values in the current review component
    this.dialogData.dataOut = true;
    this.dialogData.close();
  }
}
