import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseDialogComponent } from './baseDialog/baseDialog.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { MapDialogComponent } from './mapDialog/mapDialog.component';
import { ShareDialogComponent } from './shareDialog/dialogShare.component';
import { ShareModule } from 'ngx-sharebuttons';
import { ChartDialogComponent } from './chartDialog/chartDialog.component';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
@NgModule({
  declarations: [BaseDialogComponent, MapDialogComponent, ShareDialogComponent, ChartDialogComponent],
  imports: [CommonModule, AppMaterialModule, ShareModule, ChartjsModule],
})
export class DialogModule {
  // static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: DialogModule,
  //     providers: [
  //       DialogService,
  //     ]
  //   };
  // }
}
