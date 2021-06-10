import { NgModule } from '@angular/core';
import { AppMaterialModule } from 'src/app/app-material.module';
import { ScenariosMapComponent } from './comparisonCard/scenariosMap/scenariosMap.component';
import { ScenariosTableComponent } from './comparisonCard/scenarios-table/scenariosTable.component';

@NgModule({
  declarations: [ScenariosMapComponent, ScenariosTableComponent],
  imports: [AppMaterialModule],
  providers: [],
  exports: [ScenariosMapComponent, ScenariosTableComponent],
})
export class DietaryChangeComponentsModule {}
