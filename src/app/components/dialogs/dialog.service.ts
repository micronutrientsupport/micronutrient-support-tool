import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseDialogService, DialogData } from './baseDialogService.abstract';
import { MapDialogComponent } from './mapDialog/mapDialog.component';
@Injectable({
  providedIn: 'root',
})
export class DialogService extends BaseDialogService {
  constructor(public dialog: MatDialog) {
    super(dialog);
  }

  public openChart(contentValue: string): Promise<DialogData> {
    return this.openDialog('chart', MapDialogComponent, {
      content: contentValue,
    });
  }
}
