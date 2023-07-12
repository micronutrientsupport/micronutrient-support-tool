import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CostEffectivenessComponent } from './costEffectiveness.component';
import { CostEffectivenessComponentsModule } from './components/costEffectivenessComponents.module';

import { GridsterModule } from 'angular-gridster2';
import { QuickMapsService } from '../quickMaps/quickMaps.service';

@NgModule({
  declarations: [CostEffectivenessComponent],
  imports: [CommonModule, CostEffectivenessComponentsModule, GridsterModule],
  exports: [CostEffectivenessComponent],
  providers: [QuickMapsService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CostEffectivenessModule {}
