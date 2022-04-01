import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TourService } from '../services/tour.service';

@Directive({
  selector: '[appTour]',
})
export class TourStageDirective implements OnInit {
  @Input() tourName: string;
  @Input() tourDescription: string;
  @Input() tourTitle: string;
  @Input() tourStage: string;
  @Input() tourPosition: string;
  @Input() tourTrigger: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  @Output() tourEnterFunction: EventEmitter<unknown> = new EventEmitter();
  @Output() tourForwardFunction: EventEmitter<unknown> = new EventEmitter();
  @Output() tourBackwardFunction: EventEmitter<unknown> = new EventEmitter();

  ngOnInit(): void {
    this.tourService.tourStepEnterObservable.subscribe((element) => {
      // If entered element macthes call the functi
      if (element && element.nativeElement == this.el.nativeElement) {
        setTimeout(() => this.tourEnterFunction.emit(), 100);
      }
    });

    this.tourService.tourStepForwardObservable.subscribe((element) => {
      if (element && element.nativeElement == this.el.nativeElement) {
        this.tourForwardFunction.emit();
        if (this.tourTrigger) {
          console.log(`Triggering tour ${this.tourTrigger}`);
          this.tourService.startTour(this.tourTrigger, null, -1);
        }
      }
    });

    this.tourService.tourStepBackwardObservable.subscribe((element) => {
      if (element && element.nativeElement == this.el.nativeElement) {
        this.tourBackwardFunction.emit();
      }
    });

    this.tourService.addStep(
      this.tourName,
      this.el.nativeElement,
      {
        title: this.tourTitle,
        description: this.tourDescription,
        position: this.tourPosition ? this.tourPosition : 'auto',
        doneBtnText: this.tourTrigger ? `${this.tourTrigger} →` : 'Finish',
      },
      parseInt(this.tourStage),
    );
  }

  constructor(private el: ElementRef, private tourService: TourService) {}
}
