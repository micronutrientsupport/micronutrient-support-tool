import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from 'src/app/app-material.module';
import { RoutesModule } from 'src/app/routes/routes.module';
import { DietaryChangeComponent } from './dietaryChange.component';
import { DietaryChangeComponentsModule } from './components/dietaryChangeComponents.module';
import { GridsterModule } from 'angular-gridster2';
import { ComponentsModule } from 'src/app/components/components.module';
import { DialogModule } from 'src/app/components/dialogs/dialog.module';
import { DescriptionComponent } from './components/description/description.component';
import { OptionsComponent } from './components/options/options.component';
import { ComparisonCardComponent } from './components/comparisonCard/comparisonCard.component';
import { DietaryChangeService } from './dietaryChange.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DietaryChangeComponent, DescriptionComponent, OptionsComponent, ComparisonCardComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    RoutesModule,
    DietaryChangeComponentsModule,
    GridsterModule,
    ComponentsModule,
    DialogModule,
    FormsModule,
  ],
  providers: [DietaryChangeService],
  exports: [DietaryChangeComponent],
})
export class DietaryChangeModule {}
