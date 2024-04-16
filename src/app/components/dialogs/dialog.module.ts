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
import { IframeDialogComponent } from './iFrameDialog/dialogIframe.component';
import { WelcomeDialogComponent } from './welcomeDialog/dialogWelcome.component';
import { WelcomeCEDialogComponent } from './welcomeCEDialog/dialogCEWelcome.component';
import { SectionSummaryRecurringCostReviewDialogComponent } from './sectionSummaryRecurringCostReviewDialog/sectionSummaryRecurringCostReviewDialog.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { ApiMetadataDialogComponent } from './apiMetadataDialog/apiMetadataDialog.component';
import { DialogStepDetailsComponent } from './dialogStepDetails/dialogStepDetails.component';
import { UserLoginDialogComponent } from './userLoginDialog/userLoginDialog.component';
import { UserRegisterDialogComponent } from './userRegisterDialog/userRegisterDialog.component';
import { InterventionInputFieldComponent } from 'src/app/pages/costEffectiveness/interventionReview/components/ceInputField/ceInputField.component';
import { PremixCostReviewDialogComponent } from './premixCostReviewDialog/premixCostReviewDialog.component';
import { ComponentsModule } from '../components.module';
import { BaselinePerformanceInfoDialogComponent } from './baselinePerformanceInfoDialog/baselinePerformanceInfoDialog.component';
import { FoodVehicleStandardDialog } from './foodVehicleStandardDialog/foodVehicleStandardDialog.component';

@NgModule({
  declarations: [
    BaseDialogComponent,
    ShareDialogComponent,
    ScenarioTypeDialogComponent,
    ApiMetadataDialogComponent,
    MapSettingsDialogComponent,
    InvalidParametersDialogComponent,
    BaselineDescriptionDialogComponent,
    BaselinePerformanceInfoDialogComponent,
    FoodVehicleStandardDialog,
    ScenarioChangeWarningComponent,
    CostEffectivenessInfoDialogComponent,
    CostEffectivenessSelectionDialogComponent,
    CeResetDialogComponent,
    MnAdditionDialogComponent,
    CeFortificationInfoDialogComponent,
    CeCalculatedFortificationInfoDialogComponent,
    SectionRecurringCostReviewDialogComponent,
    SectionStartUpCostReviewDialogComponent,
    IframeDialogComponent,
    WelcomeDialogComponent,
    WelcomeCEDialogComponent,
    SectionSummaryRecurringCostReviewDialogComponent,
    PremixCostReviewDialogComponent,
    DialogStepDetailsComponent,
    UserLoginDialogComponent,
    UserRegisterDialogComponent,
    InterventionInputFieldComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    ShareModule,
    RouterModule,
    RoutesModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [BaseDialogComponent, InterventionInputFieldComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DialogModule {}
