import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CostEffectivenessComponent } from './costEffectiveness.component';
import { CostEffectivenessComponentsModule } from './components/costEffectivenessComponents.module';
import { GridsterModule } from 'angular-gridster2';

@NgModule({
  declarations: [CostEffectivenessComponent],
  imports: [CommonModule, CostEffectivenessComponentsModule, GridsterModule],
  exports: [CostEffectivenessComponent],
})
export class CostEffectivenessModule {}
