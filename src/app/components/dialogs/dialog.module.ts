import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseDialogComponent } from './baseDialog/baseDialog.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { ChartDialogComponent } from './chartDialog/chartDialog.component';
import { DialogService } from './dialog.service';

@NgModule({
  declarations: [BaseDialogComponent, ChartDialogComponent],
  imports: [CommonModule, AppMaterialModule],
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
