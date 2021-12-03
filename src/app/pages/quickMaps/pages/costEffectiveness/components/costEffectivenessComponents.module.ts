import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescriptionComponent } from './description/description.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { MenuComponent } from './menu/menu.component';
import { InterventionCreationComponent } from './interventionCreation/interventionCreation.component';
import { InterventionComparisonComponent } from './interventionComparison/interventionComparison.component';
import { InterventionComponent } from './intervention/intervention.component';
import { InterventionComparisonCardComponent } from './interventionComparison/interventionComparisonCard/interventionComparisonCard.component';
import { DialogModule } from 'src/app/components/dialogs/dialog.module';
@NgModule({
  declarations: [
    DescriptionComponent,
    MenuComponent,
    InterventionCreationComponent,
    InterventionComparisonComponent,
    InterventionComponent,
    InterventionComparisonCardComponent,
  ],
  imports: [CommonModule, AppMaterialModule, DialogModule],
  exports: [
    DescriptionComponent,
    MenuComponent,
    InterventionCreationComponent,
    InterventionComparisonComponent,
    InterventionComponent,
    InterventionComparisonCardComponent,
  ],
})
export class CostEffectivenessComponentsModule {}
