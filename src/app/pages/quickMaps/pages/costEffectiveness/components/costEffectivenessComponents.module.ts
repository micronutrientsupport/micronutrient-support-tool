import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescriptionComponent } from './description/description.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { InterventionComponent } from './intervention/intervention.component';

@NgModule({
  declarations: [DescriptionComponent, InterventionComponent],
  imports: [CommonModule, AppMaterialModule],
  exports: [DescriptionComponent, InterventionComponent],
})
export class CostEffectivenessComponentsModule {}
