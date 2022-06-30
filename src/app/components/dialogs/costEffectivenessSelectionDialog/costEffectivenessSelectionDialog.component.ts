import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InterventionsDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/interventionDictionaryItem';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-costEffectivenessSelectionDialog',
  templateUrl: './costEffectivenessSelectionDialog.component.html',
  styleUrls: ['./costEffectivenessSelectionDialog.component.scss'],
})
export class CostEffectivenessSelectionDialogComponent implements OnInit {
  public interventions: Array<InterventionsDictionaryItem>;
  public selectedIntervention: InterventionsDictionaryItem = null;

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public dialogData: DialogData) {
    this.interventions = dialogData.dataIn as Array<InterventionsDictionaryItem>;
  }

  ngOnInit(): void {
    // add content
  }

  public closeDialog(): void {
    this.dialog.closeAll();
  }

  public createIntervention(): void {
    if (null != this.selectedIntervention.name) {
      this.dialogData.dataOut = this.selectedIntervention;
    }
    this.dialog.closeAll();
  }

  setIntervention(intervention: InterventionsDictionaryItem): void {
    this.selectedIntervention = intervention
  }
}
