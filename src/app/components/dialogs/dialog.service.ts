import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InterventionsDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/interventionDictionaryItem';
import { Costs } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { BaseDialogService, DialogData } from './baseDialogService.abstract';
import { BaselineDescriptionDialogComponent } from './baselineDescriptionDialog/baselineDescriptionDialog.component';
import { CeResetDialogComponent } from './ceResetDialog/ceResetDialog.component';
import { CostEffectivenessInfoDialogComponent } from './costEffectivenessInfoDialog/costEffectivenessInfoDialog.component';
import { CostEffectivenessSelectionDialogComponent } from './costEffectivenessSelectionDialog/costEffectivenessSelectionDialog.component';
import { InvalidParametersDialogComponent } from './invalidParametersDialog/invalidParametersDialog.component';
import { MapSettingsDialogComponent } from './mapSettingsDialog/mapSettingsDialog.component';
import { MnAdditionDialogComponent } from './mnAdditionDialog/mnAdditionDialog.component';
import { ScenarioChangeWarningComponent } from './scenarioChangeWarning/scenarioChangeWarning.component';
import { ScenarioTypeDialogComponent } from './scenarioTypeDialog/scenarioTypeDialog.component';
import { SectionCostReviewDialogComponent } from './sectionCostReviewDialog/sectionCostReviewDialog.component';
import { ShareDialogComponent } from './shareDialog/dialogShare.component';
@Injectable()
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
    });
  }

  public openCESelectionDialog(interventions: Array<InterventionsDictionaryItem>): Promise<DialogData> {
    return this.openDialog(
      'costEffectivenessSelectionDialog',
      CostEffectivenessSelectionDialogComponent,
      false,
      interventions,
    );
  }
  public openCEInfoDialog(): Promise<DialogData> {
    return this.openDialog('costEffectivenessInfoDialog', CostEffectivenessInfoDialogComponent);
  }
  public openScenarioTypeDialog(): Promise<DialogData> {
    return this.openDialog('scenarioTypeDialog', ScenarioTypeDialogComponent);
  }

  public openBaselineDescriptionDialog(): Promise<DialogData> {
    return this.openDialog('baselineDescriptionDialog', BaselineDescriptionDialogComponent);
  }

  public openMapSettingsDialog(colourPaletteId: string): Promise<DialogData<string>> {
    return this.openDialog('mapSettings', MapSettingsDialogComponent, false, colourPaletteId);
  }

  public openInvalidParametersDialog(): Promise<DialogData<boolean>> {
    return this.openDialog('invalidParametersDialog', InvalidParametersDialogComponent);
  }

  public openScenarioChangeWarningDialog(): Promise<DialogData<boolean>> {
    return this.openDialog('scenarioChangeWarningDialog', ScenarioChangeWarningComponent, false);
  }
  public openCEResetDialog(): Promise<DialogData<boolean>> {
    return this.openDialog('openCEResetDialog', CeResetDialogComponent, false);
  }

  public openMnAdditionDialog(): Promise<DialogData<boolean>> {
    return this.openDialog('openMnAdditionDialog', MnAdditionDialogComponent, false);
  }

  public openSectionCostReviewDialog(costs: Costs): Promise<DialogData<Costs>> {
    return this.openDialog('openSectionCostReviewDialog', SectionCostReviewDialogComponent, false, costs);
  }
}
