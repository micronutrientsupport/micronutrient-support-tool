import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeatureFlagDisableDirective } from './feature-flag-disable';
import { FeatureFlagDirective } from './feature-flag.directive';

@NgModule({
  declarations: [FeatureFlagDirective, FeatureFlagDisableDirective],
  imports: [CommonModule],
  exports: [FeatureFlagDirective, FeatureFlagDisableDirective],
})
export class DirectivesModule {}
