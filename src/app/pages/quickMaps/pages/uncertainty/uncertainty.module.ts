import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UncertaintyComponent } from './uncertainty.component';
import { UncertaintyDescriptionComponent } from './uncertaintyDescription/uncertaintyDescription.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { GridsterModule } from 'angular-gridster2';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RoutesModule } from 'src/app/routes/routes.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { DialogModule } from 'src/app/components/dialogs/dialog.module';
import { QuickMapsComponentsModule } from '../../components/quickMapsComponents.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { UncertaintyNutrientAvailabilityComponent } from './uncertaintyNutrientAvaliability/uncertaintyNutrientAvailability.component';
import { UncertaintyFoodAvailablityComponent } from './uncertaintyFoodAvaliablity/uncertaintyFoodAvailablity.component';
import { UncertaintySummaryComponent } from './uncertaintySummary/uncertaintySummary.component';
import { UtilitiesModule } from 'src/utility/utilities.module';

@NgModule({
  declarations: [
    UncertaintyComponent,
    UncertaintyDescriptionComponent,
    UncertaintyFoodAvailablityComponent,
    UncertaintyNutrientAvailabilityComponent,
    UncertaintySummaryComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AppMaterialModule,
    ReactiveFormsModule,
    RoutesModule,
    GridsterModule,
    ComponentsModule,
    DialogModule,
    QuickMapsComponentsModule,
    PipesModule,
    UtilitiesModule,
  ],
  exports: [UncertaintyComponent],
})
export class UncertaintyModule {}
