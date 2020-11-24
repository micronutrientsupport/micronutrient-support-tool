import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseDialogComponent } from './baseDialog/baseDialog.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { MapDialogComponent } from './mapDialog/mapDialog.component';
@NgModule({
  declarations: [BaseDialogComponent, MapDialogComponent],
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
