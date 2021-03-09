import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
export class InvalidParametersComponent {

  public ROUTES = AppRoutes;

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: DialogData<ShareDialogData>,

  ) {
  }
}
