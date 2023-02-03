import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CostEffectivenessService } from 'src/app/pages/quickMaps/pages/costEffectiveness/costEffectiveness.service';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-ce-reset-dialog',
  templateUrl: './ceResetDialog.component.html',
  styleUrls: ['./ceResetDialog.component.scss'],
})
export class CeResetDialogComponent {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    private ceService: CostEffectivenessService,
  ) {}

  public closeDialog(): void {
    this.dialog.closeAll();
  }

  public resetAll(): void {
    this.ceService.setResetIndustryInfoForm();
    this.dialog.closeAll();
  }
}
