import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CostEffectivenessComponent } from './costEffectiveness.component';
import { CostEffectivenessComponentsModule } from './components/costEffectivenessComponents.module';

@NgModule({
  declarations: [CostEffectivenessComponent],
  imports: [CommonModule, CostEffectivenessComponentsModule],
  exports: [CostEffectivenessComponent],
})
export class CostEffectivenessModule {}
