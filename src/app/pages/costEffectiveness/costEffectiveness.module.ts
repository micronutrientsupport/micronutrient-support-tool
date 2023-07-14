import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CostEffectivenessComponent } from './costEffectiveness.component';
import { CostEffectivenessComponentsModule } from './components/costEffectivenessComponents.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { GridsterModule } from 'angular-gridster2';
import { QuickMapsService } from '../quickMaps/quickMaps.service';
// import { InterventionReviewModule } from './interventionReview.module';
import { costEffectivenessRoutingModule } from './costEffectiveness-routing.module';

@NgModule({
  declarations: [CostEffectivenessComponent],
  imports: [
    ComponentsModule,
    CommonModule,
    CostEffectivenessComponentsModule,
    GridsterModule,
    // InterventionReviewModule,
    costEffectivenessRoutingModule,
  ],
  exports: [CostEffectivenessComponent],
  providers: [QuickMapsService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CostEffectivenessModule {}
