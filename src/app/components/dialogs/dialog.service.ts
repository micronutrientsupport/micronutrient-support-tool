import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InterventionsDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/interventionDictionaryItem';
import { MicronutrientDictionaryItem } from 'src/app/apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { RecurringCost, RecurringCosts } from 'src/app/apiAndObjects/objects/interventionRecurringCosts';
import { StartUpCosts } from 'src/app/apiAndObjects/objects/interventionStartupCosts';
import { BaseDialogService, DialogData } from './baseDialogService.abstract';
import { BaselineDescriptionDialogComponent } from './baselineDescriptionDialog/baselineDescriptionDialog.component';
import { CeCalculatedFortificationInfoDialogComponent } from './ceCalculatedFortificationInfoDialog/ceCalculatedFortificationInfoDialog.component';
import { CeFortificationInfoDialogComponent } from './ceFortificationInfoDialog/ceFortificationInfoDialogcomponent';
import { CeResetDialogComponent } from './ceResetDialog/ceResetDialog.component';
import { CostEffectivenessInfoDialogComponent } from './costEffectivenessInfoDialog/costEffectivenessInfoDialog.component';
import { CostEffectivenessSelectionDialogComponent } from './costEffectivenessSelectionDialog/costEffectivenessSelectionDialog.component';
import { InvalidParametersDialogComponent } from './invalidParametersDialog/invalidParametersDialog.component';
import { MapSettingsDialogComponent } from './mapSettingsDialog/mapSettingsDialog.component';
import { MnAdditionDialogComponent } from './mnAdditionDialog/mnAdditionDialog.component';
import { ScenarioChangeWarningComponent } from './scenarioChangeWarning/scenarioChangeWarning.component';
import { ScenarioTypeDialogComponent } from './scenarioTypeDialog/scenarioTypeDialog.component';
import { SectionRecurringCostReviewDialogComponent } from './sectionRecurringCostReviewDialog/sectionRecurringCostReviewDialog.component';
import { SectionStartUpCostReviewDialogComponent } from './sectionStartUpCostReviewDialog/sectionStartUpCostReviewDialog.component';
import { SectionSummaryRecurringCostReviewDialogComponent } from './sectionSummaryRecurringCostReviewDialog copy/sectionSummaryRecurringCostReviewDialog.component';
import { ShareDialogComponent } from './shareDialog/dialogShare.component';
@Injectable()
export class DialogService extends BaseDialogService {
  constructor(public dialog: MatDialog) {
    super(dialog);
  }

  public openShareDialog(shareLink: string): Promise<DialogData> {
    return this.openDialog('sharingDialog', ShareDialogComponent, true, { shareLink });
  }

  public openDialogForComponent<T = unknown>(
    contentComponent: ComponentType<unknown>,
    data?: T,
    width = '80vw',
    height = '80vh',
  ): Promise<DialogData<T>> {
    return this.openDialog('anyDialog', contentComponent, true, data, {
      width,
      height,
    });
  }

  public openCESelectionDialog(
    interventions: Array<InterventionsDictionaryItem>,
  ): Promise<DialogData<Array<InterventionsDictionaryItem>>> {
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

  public openMnAdditionDialog(): Promise<DialogData<Array<MicronutrientDictionaryItem>>> {
    return this.openDialog('openMnAdditionDialog', MnAdditionDialogComponent, false);
  }
  public openFortificationInfoDialog(): Promise<DialogData> {
    return this.openDialog('ceFortificationInfoDialog', CeFortificationInfoDialogComponent);
  }
  public openCalculatedFortificationInfoDialog(): Promise<DialogData> {
    return this.openDialog('ceCalculatedFortificationInfoDialog', CeCalculatedFortificationInfoDialogComponent);
  }

  public openSectionRecurringCostReviewDialog(
    costs: RecurringCosts,
    width = '80vw',
    height = '80vh',
  ): Promise<DialogData<RecurringCosts>> {
    return this.openDialog('openSectionCostReviewDialog', SectionRecurringCostReviewDialogComponent, false, costs, {
      width: width,
      height: height,
    });
  }

  public openSectionStartUpCostReviewDialog(
    costs: StartUpCosts,
    width = '80vw',
    height = '80vh',
  ): Promise<DialogData<StartUpCosts>> {
    return this.openDialog('openSectionCostReviewDialog', SectionStartUpCostReviewDialogComponent, false, costs, {
      width: width,
      height: height,
    });
  }

  public openSectionSummaryRecurringCostReviewDialog(
    costs: RecurringCost,
    width = '80vw',
    height = '80vh',
  ): Promise<DialogData<RecurringCost>> {
    return this.openDialog(
      'openSectionCostReviewDialog',
      SectionSummaryRecurringCostReviewDialogComponent,
      false,
      costs,
      {
        width: width,
        height: height,
      },
    );
  }
}
