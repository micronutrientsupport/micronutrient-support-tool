import { Directive, ElementRef, Input, Renderer2, ViewContainerRef } from '@angular/core';
@Directive({
  selector: '[appFeatureFlagDisable]',
})
export class FeatureFlagDisableDirective {
  @Input() set featureFlag(appFeatureFlagDisable: string) {
    console.log(this.el);
    console.log('Set', this.el.nativeElement);
    console.log(this.el.nativeElement.disabled);
    this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
    this.el.nativeElement.classList.add('mat-button-disabled');
    console.log(this.el.nativeElement.disabled);
    this.viewContainer.clear();
  }

  constructor(private viewContainer: ViewContainerRef, private renderer: Renderer2, private el: ElementRef) {}
}
