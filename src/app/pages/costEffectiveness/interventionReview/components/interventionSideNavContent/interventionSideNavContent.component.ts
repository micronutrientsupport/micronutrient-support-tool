import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { filter, Subscription } from 'rxjs';
import { AppRoutes } from 'src/app/routes/routes';
import { InterventionSideNavContentService } from './interventionSideNavContent.service';
import { InterventionDataService } from 'src/app/services/interventionData.service';
import { Intervention } from 'src/app/apiAndObjects/objects/intervention';
import { throws } from 'assert';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-intervention-sidenav-content',
  templateUrl: './interventionSideNavContent.component.html',
  styleUrls: ['./interventionSideNavContent.component.scss'],
})
export class InterventionSideNavContentComponent {
  constructor(
    private intSideNavService: InterventionSideNavContentService,
    private interventionDataService: InterventionDataService,
    private router: Router,
  ) {
    this.activeInterventionId = this.interventionDataService.getActiveInterventionId();
    this.subscriptions.push(
      this.intSideNavService.stepperPositionObs.subscribe((position: number) => {
        this.setStepperPosition(position);
      }),
    );
  }

  private stepperSubscription: Subscription;
  private currentInterventionType: string;
  public activeInterventionId: string;
  private subscriptions = new Array<Subscription>();
  public ROUTES = AppRoutes;

  @ViewChildren('cmp') components: QueryList<MatStepper>;

  public sections = [];

  public currentStepPosition = 0;

  public ngOnInit() {
    this.stepperSubscription = this.router.events
      .pipe(filter((e: RouterEvent) => e instanceof NavigationEnd))
      .subscribe((e: RouterEvent) => {
        this.inferSidebarStepPosition(e.url);
      });
  }

  public inferSidebarStepPosition(url: string) {
    let i = -1;
    let count = 0;
    this.sections.find((section) => {
      i = section.pages.findIndex((page) => {
        return url.startsWith('/cost-effectiveness/' + page.route.getRouterPath());
      });
      if (i < 0) {
        count += section.pages.length;
      }
      return i >= 0;
    });
    this.intSideNavService.setCurrentStepperPosition(count + i, this.currentInterventionType);
  }

  public ngOnDestroy() {
    this.stepperSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.components.changes.subscribe(() => {
      this.inferSidebarStepPosition(this.router.url);
    });

    // print array of CustomComponent objects
    void this.interventionDataService.getIntervention(this.activeInterventionId).then((intervention: Intervention) => {
      this.currentInterventionType = intervention.fortificationTypeId;
      this.sections = this.intSideNavService.getSections(this.currentInterventionType);
      this.inferSidebarStepPosition(this.router.url);
    });
  }

  public sectionCount(i: number): number {
    return this.sections.reduce((acc, curr, index) => {
      if (index > i - 1) {
        return acc;
      }
      acc += curr.pages.length;
      return acc;
    }, 0);
  }

  public addNBbspTitle(title: string): string {
    return title.replace(/\s+/g, '&nbsp;');
  }

  public setStepperPosition(position: number): void {
    if (this.components) {
      const steppers = this.components.toArray();

      let stepCount = 0;
      let found = false;
      steppers.forEach((stepper, index) => {
        if (position < stepCount + stepper.steps.length && !found) {
          stepper.selectedIndex = position - stepCount;
          found = true;
        }
        stepCount += stepper.steps.length;
      });
    }
    this.currentStepPosition = position;
  }
}
