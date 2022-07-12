import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DecimalInputDirective } from './decimalInput.directive';
import { FeatureFlagDisableDirective } from './feature-flag-disable';
import { FeatureFlagDirective } from './feature-flag.directive';
import { TourStageDirective } from './tour-stage-directive';

@NgModule({
  declarations: [FeatureFlagDirective, FeatureFlagDisableDirective, TourStageDirective, DecimalInputDirective],
  imports: [CommonModule],
  exports: [FeatureFlagDirective, FeatureFlagDisableDirective, TourStageDirective, DecimalInputDirective],
})
export class DirectivesModule {}
