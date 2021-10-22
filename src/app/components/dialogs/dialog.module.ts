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
import { ScenarioChangeWarningComponent } from './scenarioChange_Warning/scenarioChangeWarning.component';
@NgModule({
  declarations: [
    BaseDialogComponent,
    ShareDialogComponent,
    ScenarioTypeDialogComponent,
    MapSettingsDialogComponent,
    InvalidParametersDialogComponent,
    BaselineDescriptionDialogComponent,
    ScenarioChangeWarningComponent,
  ],
  imports: [CommonModule, AppMaterialModule, ShareModule, RouterModule, RoutesModule],
  exports: [BaseDialogComponent],
})
export class DialogModule {}
