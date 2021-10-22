import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-description-dialog',
  templateUrl: './baselineDescriptionDialog.component.html',
  styleUrls: ['./baselineDescriptionDialog.component.scss'],
})
export class BaselineDescriptionDialogComponent {
  public copyLinkUrl: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private clipboard: Clipboard,
    private snackbarService: SnackbarService,
  ) {}

  public copyLink(): void {
    this.clipboard.copy(this.copyLinkUrl);
    this.snackbarService.openSnackBar('Link copied: ' + this.copyLinkUrl, 'close');
  }
}
