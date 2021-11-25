import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescriptionComponent } from './description/description.component';
import { AppMaterialModule } from 'src/app/app-material.module';

@NgModule({
  declarations: [DescriptionComponent],
  imports: [CommonModule, AppMaterialModule],
  exports: [DescriptionComponent],
})
export class CostEffectivenessComponentsModule {}
