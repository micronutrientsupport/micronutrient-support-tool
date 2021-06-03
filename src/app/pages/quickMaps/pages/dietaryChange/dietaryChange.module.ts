import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from 'src/app/app-material.module';
import { RoutesModule } from 'src/app/routes/routes.module';
import { DietaryChangeComponent } from './dietaryChange.component';
import { DietaryChangeComponentsModule } from './components/dietaryChangeComponents.module';

@NgModule({
  declarations: [DietaryChangeComponent],
  imports: [CommonModule, AppMaterialModule, RoutesModule, DietaryChangeComponentsModule],
  providers: [],
  exports: [DietaryChangeComponent],
})
export class DietaryChangeModule {}
