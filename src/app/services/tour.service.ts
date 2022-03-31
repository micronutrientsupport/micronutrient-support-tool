import { ThrowStmt } from '@angular/compiler';
import { ElementRef, Injectable } from '@angular/core';
import * as Driver from 'driver.js';
import { type } from 'os';
import { BehaviorSubject } from 'rxjs';
import { reduce } from 'rxjs/operators';

@Injectable()
export class TourService {
  tourDriver: Driver;
  tourSteps: Map<string, Map<number, Driver.Step>>;
  tourCurrentStep = 0;
  tourActive = false;
  tourCurrentName: string;

  private readonly tourStepEnter = new BehaviorSubject<ElementRef>(null);
  public tourStepEnterObservable = this.tourStepEnter.asObservable();

  private readonly tourStepBackward = new BehaviorSubject<ElementRef>(null);
  public tourStepBackwardObservable = this.tourStepBackward.asObservable();

  private readonly tourStepForward = new BehaviorSubject<ElementRef>(null);
  public tourStepForwardObservable = this.tourStepForward.asObservable();

  constructor() {
    this.tourSteps = new Map<string, Map<number, Driver.Step>>();
    this.tourDriver = new Driver({
      onHighlightStarted: () => {
        //
      },
      opacity: 0.5,
      onReset: () => {
        const currentStep = this.tourCurrentStep;
        if (this.tourSteps.has(this.tourCurrentName)) {
          const totalSteps = Array.from(this.tourSteps.get(this.tourCurrentName)).length - 1;
          console.log(`Tour ${this.tourCurrentName} closed at position ${this.tourCurrentStep}/${totalSteps}`);
          if (currentStep < 0 || currentStep === totalSteps) {
            // if it's the end of the tour, mark it as so
            this.tourActive = false;
            this.tourCurrentStep = 0;
          }
        }
      },
      onNext: (element) => {
        // trigger the `tourForward` function in the tourDirective
        const highlightedElementRef: ElementRef = new ElementRef(element.getNode());
        this.tourStepForward.next(highlightedElementRef);
        this.tourCurrentStep++;
      },
      onPrevious: (element) => {
        // trigger the `tourBackward` function in the tourDirective
        const highlightedElementRef: ElementRef = new ElementRef(element.getNode());
        this.tourStepBackward.next(highlightedElementRef);
        this.tourCurrentStep--;
      },
      onHighlighted: (element) => {
        // trigger the `tourEnter` function in the tourDirective
        console.log(`Viewing ${this.tourCurrentName} step ${this.tourCurrentStep}`);
        // console.log(element.getCalculatedPosition());
        const highlightedElementRef: ElementRef = new ElementRef(element.getNode());
        this.tourStepEnter.next(highlightedElementRef);
      },
    });

    this.createOverlayWelcomeTour();
  }

  private tourStepIsDefined(tourName: string, step: number) {
    return this.tourSteps.has(tourName) && this.tourSteps.get(tourName).has(step);
  }

  private updateTourRunnerSteps(tourName: string) {
    if (this.tourSteps.has(tourName)) {
      //console.log(`Update tour driver steps to those defined for tour ${tourName}`);
      const stepMap = this.tourSteps.get(tourName);
      //convert map to array and sort
      const stepArray = Array.from(stepMap);
      stepArray.sort((a, b) => {
        return a[0] - b[0];
      });
      const steps = stepArray.map((a) => {
        return a[1];
      });
      this.tourDriver.defineSteps(steps);
    }
  }

  public startTour(tourName?: string, event?: Event, stage?: number): void {
    console.log(
      `Set tour ${tourName} running at position ${
        typeof stage !== 'undefined' ? stage : this.tourCurrentStep > 0 ? this.tourCurrentStep : 0
      }`,
    );

    if (this.tourCurrentName !== tourName) {
      console.log('Switching tours');
      this.tourDriver.reset();
    }
    this.tourActive = true;
    this.tourCurrentName = tourName;

    if (this.tourSteps.has(tourName)) {
      this.updateTourRunnerSteps(tourName);
      const startStep = typeof stage !== 'undefined' ? stage : this.tourCurrentStep > 0 ? this.tourCurrentStep : 0;
      //this.tourDriver.reset();
      this.tourDriver.start(startStep);
    }
    event ? event.stopPropagation() : null;
  }

  public addStep(
    tourName: string,
    element: string | HTMLElement | Node,
    popup: Driver.PopoverOptions,
    position: number,
    transparent = false,
  ): void {
    console.log(
      `Add tour step (${popup.title}) to ${tourName} in position ${position} | (Running = ${this.tourActive})`,
    );

    let stepMap = this.tourSteps.get(tourName);
    if (!stepMap) {
      stepMap = new Map<number, Driver.Step>();
    }

    // append the tour name to the popup title so we can display and style it
    // in the popup
    popup.title = `<span class="tour-title"><strong>Tour:</strong> ${tourName}</span>${popup.title}`;

    stepMap.set(position, {
      element: element,
      popover: popup,
      stageBackground: transparent ? 'transparent' : '#fff',
    });
    this.tourSteps.set(tourName, stepMap);

    if (this.tourActive && this.tourCurrentName === tourName) {
      // Does the 'current' step exist?
      if (this.tourStepIsDefined(tourName, this.tourCurrentStep)) {
        console.log(`Current position (${this.tourCurrentStep}) exists so update tour runner steps and reset the tour`);
        this.updateTourRunnerSteps(tourName);
        //this.tourDriver.reset();
        this.tourDriver.start(this.tourCurrentStep);
      } else {
        console.log(`Current position (${this.tourCurrentStep}) doesn't exist yet so wait`);
      }
    }
  }

  public createOverlayWelcomeTour(): void {
    this.addStep(
      'Welcome to Quick MAPS',
      'body',
      {
        className: 'popup-overlay',
        title: 'Welcome to QuickMAPS',
        description:
          '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mollis mollis turpis, auctor sollicitudin lorem sagittis ut. Sed pharetra dui iaculis urna scelerisque tincidunt. Nam a mauris id lorem lobortis suscipit. Mauris felis magna, lobortis a arcu nec, porta faucibus tellus. Aliquam aliquet cursus volutpat. Nam felis nunc, volutpat ac efficitur eget, tincidunt quis nulla. Duis iaculis pulvinar tortor, id vestibulum arcu consectetur et. Fusce consectetur nisl ut neque sollicitudin, quis consequat est suscipit. Vestibulum eu nibh lacinia, mollis mi et, egestas dui. Nunc eu neque tincidunt, bibendum purus id, venenatis nibh. Proin sit amet sodales nisl.</p><p>Praesent pharetra non leo vel pellentesque. Nam id tortor augue. Sed ac pulvinar nulla, sed consequat quam. Cras elit dui, fermentum eu elementum non, condimentum et mauris. Mauris placerat diam non tortor semper, eu lobortis velit hendrerit. Nam sed urna erat. Aenean feugiat fermentum est, ut placerat nulla porttitor eget.</p> \
          <p class="text-center"><button class="driver-button" id="overlayRunTourButton">View a tour of Quick MAPS</button></p>',
        position: 'mid-center',
      },
      0,
      true,
    );

    this.tourStepEnterObservable.subscribe((enteredElement) => {
      const elementRef = new ElementRef(document.querySelector('body'));
      if (enteredElement && elementRef && elementRef.nativeElement == enteredElement.nativeElement) {
        setTimeout(
          () =>
            document.getElementById('overlayRunTourButton').addEventListener(
              'click',
              function () {
                this.startTour('Quick MAPS Sidebar');
              }.bind(this),
              false,
            ),
          100,
        );
      }
    });
  }
}
