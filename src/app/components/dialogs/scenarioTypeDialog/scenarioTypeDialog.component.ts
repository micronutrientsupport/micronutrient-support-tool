import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-dialog-scenario-type',
  templateUrl: './scenarioTypeDialog.component.html',
  styleUrls: ['./scenarioTypeDialog.component.scss'],
})
export class ScenarioTypeDialogComponent {
  public copyLinkUrl: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
    private clipboard: Clipboard,
    private snackbarService: SnackbarService,
  ) {}

  public copyLink(): void {
    this.clipboard.copy(this.copyLinkUrl);
    this.snackbarService.openSnackBar('Link copied: ' + this.copyLinkUrl, 'close');
  }
}
