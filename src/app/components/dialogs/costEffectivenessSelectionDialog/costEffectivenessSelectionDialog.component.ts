import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../baseDialogService.abstract';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-costEffectivenessSelectionDialog',
  templateUrl: './costEffectivenessSelectionDialog.component.html',
  styleUrls: ['./costEffectivenessSelectionDialog.component.scss'],
})
export class CostEffectivenessSelectionDialogComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    private dialogService: DialogService,
  ) {
    // add content
  }

  ngOnInit(): void {
    // add content
  }
  public openCEInterventionDialog(): void {
    void this.dialogService.openCEInterventionDialog();
  }
  public closeDialog(): void {
    this.dialog.closeAll();
  }
}
