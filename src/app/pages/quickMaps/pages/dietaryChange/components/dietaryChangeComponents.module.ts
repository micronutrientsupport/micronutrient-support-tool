import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScenariosMapComponent } from './comparisonCard/scenariosMap/scenariosMap.component';
import { ScenariosTableComponent } from './comparisonCard/scenarios-table/scenariosTable.component';
import { FormsModule } from '@angular/forms';
import { AppMaterialModule } from 'src/app/app-material.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { DialogModule } from 'src/app/components/dialogs/dialog.module';
import { DietaryChangeService } from '../dietaryChange.service';
import { ComparisonCardComponent } from './comparisonCard/comparisonCard.component';
import { DescriptionComponent } from './description/description.component';
import { OptionsComponent } from './options/options.component';

@NgModule({
  declarations: [
    ScenariosMapComponent,
    ScenariosTableComponent,
    DescriptionComponent,
    OptionsComponent,
    ComparisonCardComponent,
  ],
  imports: [CommonModule, AppMaterialModule, ComponentsModule, DialogModule, FormsModule],
  providers: [DietaryChangeService],
  exports: [
    ScenariosMapComponent,
    ScenariosTableComponent,
    DescriptionComponent,
    OptionsComponent,
    ComparisonCardComponent,
  ],
})
export class DietaryChangeComponentsModule {}
