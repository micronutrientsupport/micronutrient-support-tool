import { NgModule } from '@angular/core';
import { AppMaterialModule } from 'src/app/app-material.module';
import { ScenariosMapComponent } from './comparisonCard/scenariosMap/scenariosMap.component';

@NgModule({
  declarations: [ScenariosMapComponent],
  imports: [AppMaterialModule],
  providers: [],
  exports: [ScenariosMapComponent],
})
export class DietaryChangeComponentsModule {}
