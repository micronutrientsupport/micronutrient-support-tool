import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FabMenuComponent } from './fab-menu/fab-menu.component';
import { AppMaterialModule } from 'src/app/app-material.module';

@NgModule({
  declarations: [FabMenuComponent],
  imports: [CommonModule, AppMaterialModule],
  exports: [FabMenuComponent],
})
export class UtilitiesModule {}
