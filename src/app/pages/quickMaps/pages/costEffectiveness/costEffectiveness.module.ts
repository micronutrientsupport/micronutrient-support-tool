import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CostEffectivenessComponent } from './costEffectiveness.component';
import { CostEffectivenessComponentsModule } from './components/costEffectivenessComponents.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { GridsterModule } from 'angular-gridster2';

@NgModule({
  declarations: [CostEffectivenessComponent],
  imports: [CommonModule, CostEffectivenessComponentsModule, ComponentsModule, GridsterModule],
  exports: [CostEffectivenessComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CostEffectivenessModule {}
