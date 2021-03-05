import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColourGradientType } from 'src/app/apiAndObjects/objects/enums/colourGradientType.enum';
import { BaseDialogService, DialogData } from './baseDialogService.abstract';
import { MapSettingsDialogComponent } from './mapSettingsDialog/mapSettingsDialog.component';
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

  public openDialogForComponent<T = any>(
    contentComponent: ComponentType<any>,
    data?: T,
    width = '80vw',
    height = '80vh',
  ): Promise<DialogData<T>> {
    return this.openDialog('anyDialog', contentComponent, true, data, {
      width,
      height,
    },
    );
  }

  public openScenarioTypeDialog(): Promise<DialogData> {
    return this.openDialog('scenarioTypeDialog', ScenarioTypeDialogComponent);
  }

  public openMapSettingsDialog(colourGradient: ColourGradientType): Promise<DialogData<ColourGradientType, ColourGradientType>> {
    return this.openDialog('mapSettings', MapSettingsDialogComponent, false, colourGradient);
  }
}
