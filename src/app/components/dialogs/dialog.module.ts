import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseDialogComponent } from './baseDialog/baseDialog.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { MapDialogComponent } from './mapDialog/mapDialog.component';
import { ShareDialogComponent } from './shareDialog/dialogShare.component';
import { ShareModule } from 'ngx-sharebuttons';
@NgModule({
  declarations: [BaseDialogComponent, MapDialogComponent, ShareDialogComponent],
  imports: [CommonModule, AppMaterialModule, ShareModule],
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
