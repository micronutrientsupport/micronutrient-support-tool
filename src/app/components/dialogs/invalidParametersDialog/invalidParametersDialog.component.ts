import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppRoutes } from 'src/app/routes/routes';
import { DialogData } from '../baseDialogService.abstract';
export interface ShareDialogData {
  shareLink: string;
}
@Component({
  selector: 'app-invalid-parameters',
  templateUrl: './invalidParametersDialog.component.html',
  styleUrls: ['./invalidParametersDialog.component.scss'],
})
export class InvalidParametersDialogComponent {
  public title = 'The data could not be loaded';
  public ROUTES = AppRoutes;

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<InvalidParametersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<ShareDialogData>,
  ) {
    dialogRef.disableClose = true;
  }

  public closeDialog(): void {
    this.dialog.closeAll();
  }
}
