import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from 'src/app/app-material.module';
import { RoutesModule } from 'src/app/routes/routes.module';
import { DietaryChangeComponent } from './dietaryChange.component';
import { DietaryChangeComponentsModule } from './components/dietaryChangeComponents.module';
import { DietaryChangeDescriptionComponent } from './components/dietaryChangeDescription/dietaryChangeDescription.component';
import { GridsterModule } from 'angular-gridster2';
import { ComponentsModule } from 'src/app/components/components.module';
import { DietaryChangeOptionsComponent } from './components/dietaryChangeOptions/dietaryChangeOptions.component';
import { DietaryChangeComparisonCardComponent } from './components/dietaryChangeComparisonCard/dietaryChangeComparisonCard.component';
import { DialogModule } from 'src/app/components/dialogs/dialog.module';

@NgModule({
  declarations: [
    DietaryChangeComponent,
    DietaryChangeDescriptionComponent,
    DietaryChangeOptionsComponent,
    DietaryChangeComparisonCardComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    RoutesModule,
    DietaryChangeComponentsModule,
    GridsterModule,
    ComponentsModule,
    DialogModule,
  ],
  providers: [],
  exports: [DietaryChangeComponent],
})
export class DietaryChangeModule {}
