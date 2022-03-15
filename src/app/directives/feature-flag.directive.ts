import { Directive, ViewContainerRef, TemplateRef, Input, OnInit } from '@angular/core';
import { FeatureFlagsService } from 'src/app/services/featureFlags.service';

@Directive({
  selector: '[appFeatureFlag]',
})
export class FeatureFlagDirective implements OnInit {
  @Input() appFeatureFlag: string | undefined;

  constructor(
    private viewContainer: ViewContainerRef,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private templateRef: TemplateRef<any>,
    private featureFlagsService: FeatureFlagsService,
  ) {}

  ngOnInit(): void {
    const flagStatus = this.featureFlagsService.isEnabled(this.appFeatureFlag ? this.appFeatureFlag : '');
    const flagContent = this.featureFlagsService.getFlagContent(this.appFeatureFlag ? this.appFeatureFlag : '');
    if (flagStatus) {
      this.viewContainer.createEmbeddedView(this.templateRef, { $implicit: flagContent });
    } else {
      this.viewContainer.clear();
    }
  }
}
