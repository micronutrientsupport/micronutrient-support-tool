import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescriptionComponent } from './description/description.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { MenuComponent } from './menu/menu.component';
import { InterventionCreationComponent } from './interventionCreation/interventionCreation.component';
import { InterventionComparisonComponent } from './interventionComparison/interventionComparison.component';

@NgModule({
  declarations: [DescriptionComponent, MenuComponent, InterventionCreationComponent, InterventionComparisonComponent],
  imports: [CommonModule, AppMaterialModule],
  exports: [DescriptionComponent, MenuComponent, InterventionCreationComponent, InterventionComparisonComponent],
})
export class CostEffectivenessComponentsModule {}
