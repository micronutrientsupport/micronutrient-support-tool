import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppRoutes } from 'src/app/routes/routes';
export interface ShareDialogData {
  shareLink: string;
}
@Component({
  selector: 'app-invalid-parameters',
  templateUrl: './invalidParametersDialog.component.html',
  styleUrls: ['./invalidParametersDialog.component.scss'],
})
export class InvalidParametersComponent {

  public ROUTES = AppRoutes;

  constructor(
    public dialog: MatDialog

  ) {
  }

  public closeDialog(): void {
    this.dialog.closeAll();
  }
}
