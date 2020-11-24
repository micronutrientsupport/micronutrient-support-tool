import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseDialogService, DialogData } from './baseDialogService.abstract';
import { ChartDialogComponent } from './chartDialog/chartDialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService extends BaseDialogService {
  constructor(public dialog: MatDialog) {
    super(dialog);
  }

  public openChart(): Promise<DialogData> {
    return this.openDialog('chart', ChartDialogComponent);
  }
}
