import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseDialogComponent } from './baseDialog/baseDialog.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { MapDialogComponent } from './mapDialog/mapDialog.component';
import { ShareDialogComponent } from './shareDialog/dialogShare.component';
import { ShareModule } from 'ngx-sharebuttons';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
import { ScenarioTypeDialogComponent } from './scenarioTypeDialog/scenarioTypeDialog.component';
@NgModule({
  declarations: [
    BaseDialogComponent,
    MapDialogComponent,
    ShareDialogComponent,
    ScenarioTypeDialogComponent,
  ],
  imports: [CommonModule, AppMaterialModule, ShareModule, ChartjsModule],
  exports: [BaseDialogComponent],
})
export class DialogModule { }
