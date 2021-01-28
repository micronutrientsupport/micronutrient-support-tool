import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseDialogService, DialogData } from './baseDialogService.abstract';
import { ScenarioTypeDialogComponent } from './scenarioTypeDialog/scenarioTypeDialog.component';
import { ShareDialogComponent } from './shareDialog/dialogShare.component';
@Injectable({
  providedIn: 'root',
})
export class DialogService extends BaseDialogService {
  constructor(public dialog: MatDialog) {
    super(dialog);
  }

  public openShareDialog(shareLink: string): Promise<DialogData> {
    return this.openDialog('sharingDialog', ShareDialogComponent, true, { shareLink });
  }

  public openDialogForComponent(
    contentComponent: ComponentType<any>,
    width = '80vw',
    height = '80vh',
  ): Promise<DialogData> {
    return this.openDialog('anyDialog', contentComponent, true, null, {
      width,
      height,
    });
  }
  public openScenarioTypeDialog(): Promise<DialogData> {
    return this.openDialog('scenarioTypeDialog', ScenarioTypeDialogComponent);
  }
}
