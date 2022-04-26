import { ElementRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as Driver from 'driver.js';
import { BehaviorSubject } from 'rxjs';
import { QuickMapsService } from '../pages/quickMaps/quickMaps.service';
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

  getScrollParent = (node: HTMLElement): HTMLElement => {
    if (node === null) {
      return null;
    }

    if (node.scrollHeight > node.clientHeight) {
      return node;
    } else {
      return this.getScrollParent(node.parentElement);
    }
  };

  constructor(private router: Router, private quickMapsService: QuickMapsService) {
    this.tourSteps = new Map<string, Map<number, Driver.Step>>();
    this.tourDriver = new Driver({
      onHighlightStarted: (Element) => {
        console.log(Element.isInView());
        const position = Element.getCalculatedPosition();
        const top = (position as unknown as Record<string, number>).top;
        const left = (position as unknown as Record<string, number>).left;
        console.log(top, left);

        console.log(`Element = `, Element.getNode());
        console.log(`Scrollparent =`, this.getScrollParent(Element.getNode() as HTMLElement));

        const parent = this.getScrollParent(Element.getNode() as HTMLElement);
        if (parent) {
          const offset = parent.offsetTop;
          const height = Element.getSize().height;
          console.log(`Scroll`, parent, ` to ${0}, ${top}-${offset}-${height}=${top - offset - height}`);
          parent.scrollTo(0, top - offset - height);
        }
      },
      opacity: 0.32,
      onReset: () => {
        const currentStep = this.tourCurrentStep;
        if (this.tourSteps.has(this.tourCurrentName)) {
          const totalSteps = Array.from(this.tourSteps.get(this.tourCurrentName)).length - 1;
          console.log(`Tour ${this.tourCurrentName} closed at position ${this.tourCurrentStep}/${totalSteps}`);
          if (currentStep < 0 || currentStep === totalSteps) {
            // if it's the end of the tour, mark it as so
            this.tourActive = false;
            this.tourCurrentStep = -1;
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
    const startStep = typeof stage !== 'undefined' ? stage : this.tourCurrentStep > 0 ? this.tourCurrentStep : 0;
    console.log(`Set tour ${tourName} running at position ${startStep}`);

    if (this.tourCurrentName !== tourName) {
      console.log('Switching tours');
      this.tourDriver.reset();
    }
    this.tourActive = true;
    this.tourCurrentName = tourName;
    this.tourCurrentStep = startStep;

    if (this.tourSteps.has(tourName)) {
      this.updateTourRunnerSteps(tourName);
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

  public startQuickMapsTour(evt: Event): void {
    this.quickMapsService.sideNavOpen();
    this.router.navigate(['/quick-maps']);
    this.startTour('Quick MAPS Sidebar', evt, 0);
  }
}
