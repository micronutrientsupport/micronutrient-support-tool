import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseDialogComponent } from './baseDialog/baseDialog.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { ShareDialogComponent } from './shareDialog/dialogShare.component';
import { ShareModule } from 'ngx-sharebuttons';
import { ScenarioTypeDialogComponent } from './scenarioTypeDialog/scenarioTypeDialog.component';
import { MapSettingsDialogComponent } from './mapSettingsDialog/mapSettingsDialog.component';
import { InvalidParametersDialogComponent } from './invalidParametersDialog/invalidParametersDialog.component';
import { RouterModule } from '@angular/router';
import { RoutesModule } from 'src/app/routes/routes.module';
import { BaselineDescriptionDialogComponent } from './baselineDescriptionDialog/baselineDescriptionDialog.component';
import { ScenarioChangeWarningComponent } from './scenarioChangeWarning/scenarioChangeWarning.component';
import { CostEffectivenessInfoDialogComponent } from './costEffectivenessInfoDialog/costEffectivenessInfoDialog.component';
import { CostEffectivenessSelectionDialogComponent } from './costEffectivenessSelectionDialog/costEffectivenessSelectionDialog.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CeResetDialogComponent } from './ceResetDialog/ceResetDialog.component';
import { MnAdditionDialogComponent } from './mnAdditionDialog/mnAdditionDialog.component';
import { CeFortificationInfoDialogComponent } from './ceFortificationInfoDialog/ceFortificationInfoDialogcomponent';
import { CeCalculatedFortificationInfoDialogComponent } from './ceCalculatedFortificationInfoDialog/ceCalculatedFortificationInfoDialog.component';
import { SectionStartUpCostReviewDialogComponent } from './sectionStartUpCostReviewDialog/sectionStartUpCostReviewDialog.component';
import { SectionRecurringCostReviewDialogComponent } from './sectionRecurringCostReviewDialog/sectionRecurringCostReviewDialog.component';
@NgModule({
  declarations: [
    BaseDialogComponent,
    ShareDialogComponent,
    ScenarioTypeDialogComponent,
    MapSettingsDialogComponent,
    InvalidParametersDialogComponent,
    BaselineDescriptionDialogComponent,
    ScenarioChangeWarningComponent,
    CostEffectivenessInfoDialogComponent,
    CostEffectivenessSelectionDialogComponent,
    CeResetDialogComponent,
    MnAdditionDialogComponent,
    CeFortificationInfoDialogComponent,
    CeCalculatedFortificationInfoDialogComponent,
    SectionRecurringCostReviewDialogComponent,
    SectionStartUpCostReviewDialogComponent,
  ],
  imports: [CommonModule, AppMaterialModule, ShareModule, RouterModule, RoutesModule, FormsModule, ReactiveFormsModule],
  exports: [BaseDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DialogModule {}
