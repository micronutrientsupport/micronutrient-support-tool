import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-scenario-change-warning',
  templateUrl: './scenarioChangeWarning.component.html',
  styleUrls: ['./scenarioChangeWarning.component.scss'],
})
export class ScenarioChangeWarningComponent {
  public confirmed: boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData<boolean>, public dialog: MatDialog) {}

  public closeDialog(): void {
    this.data.dataOut = false;
    this.dialog.closeAll();
  }

  public allowChange(): void {
    this.data.dataOut = true;
    this.dialog.closeAll();
  }
}
