import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseDialogComponent } from './baseDialog/baseDialog.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { ShareDialogComponent } from './shareDialog/dialogShare.component';
import { ShareModule } from 'ngx-sharebuttons';
import { ScenarioTypeDialogComponent } from './scenarioTypeDialog/scenarioTypeDialog.component';
import { MapSettingsDialogComponent } from './mapSettingsDialog/mapSettingsDialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ColorSliderComponent } from './mapSettingsDialog/colorPicker/colorSlider/colorSlider.component';
import { ColorPaletteComponent } from './mapSettingsDialog/colorPicker/colorPalette/colorPalette.component';
@NgModule({
  declarations: [
    BaseDialogComponent,
    ShareDialogComponent,
    ScenarioTypeDialogComponent,
    MapSettingsDialogComponent,
    ColorSliderComponent,
    ColorPaletteComponent,
  ],
  imports: [CommonModule, AppMaterialModule, ShareModule, ReactiveFormsModule, FormsModule, MatFormFieldModule],
  exports: [BaseDialogComponent],
})
export class DialogModule {}
