import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppRoute, AppRoutes } from 'src/app/routes/routes';

@Injectable()
export class InterventionSideNavContentService {
  private readonly stepperPositionSrc = new BehaviorSubject<number>(null);
  public stepperPositionObs = this.stepperPositionSrc.asObservable();

  private previousStepPosition = 0;
  private currentStepPosition = 0;
  private currentInterventionType: string;

  public sections = [];

  public BfDSections = [
    {
      title: 'Test',
      pages: [
        {
          title: 'Foo',
          description: 'Foo!',
        },
        {
          title: 'Bar',
          description: 'Bar!',
        },
      ],
    },
  ];

  public lsFFsections = [
    {
      title: 'Intervention',
      pages: [
        {
          title: 'Baseline performance',
          description: 'Review and update baseline performance assumptions and food vehicle standards/targets.',
          route: AppRoutes.INTERVENTION_REVIEW_BASELINE,
        },
        {
          title: 'Performance over time',
          description: 'Review and update assumptions about program performance over time.',
          route: AppRoutes.INTERVENTION_REVIEW_COMPLIANCE,
          skip: ['Costs', 'Effectiveness'],
        },
      ],
    },
    {
      title: 'Costs',
      pages: [
        {
          title: 'Industry information',
          description: 'Review and update information about the food vehicle industry.',
          route: AppRoutes.INTERVENTION_REVIEW_INDUSTRY_INFORMATION,
        },
        {
          title: 'Monitoring information',
          description: 'Review and update intervention monitoring assumptions.',
          route: AppRoutes.INTERVENTION_REVIEW_MONITORING_INFORMATION,
        },
        {
          title: 'Startup/Scaleup costs',
          description: 'Review and update costs related to the startup and scaleup of the intervention program.',
          route: AppRoutes.INTERVENTION_REVIEW_STARTUP_SCALEUP_COSTS,
        },
        {
          title: 'Recurring costs',
          description: 'Review and update the recurring costs of the intervention program.',
          route: AppRoutes.INTERVENTION_REVIEW_RECURRING_COSTS,
        },
        {
          title: 'Cost summary',
          description: 'View and download summary intervention cost estimates',
          route: AppRoutes.INTERVENTION_REVIEW_COST_SUMMARY,
        },
      ],
    },
    {
      title: 'Effectiveness',
      pages: [
        {
          title: 'Micronutrient losses',
          description: 'Information about this step',
          route: AppRoutes.INTERVENTION_REVIEW_EXPECTED_LOSSES,
        },
        {
          title: 'Projected number of households',
          description: 'Information about this step.',
          route: AppRoutes.INTERVENTION_REVIEW_EFFECTIVENESS_HOUSEHOLDS,
        },
        {
          title: 'Nutrient requirements',
          description: 'Information about this step.',
          route: AppRoutes.INTERVENTION_REVIEW_EFFECTIVENESS_METRICS,
        },
        {
          title: 'Effectiveness summary',
          description: 'View and download summary intervention effectiveness estimates.',
          route: AppRoutes.INTERVENTION_REVIEW_EFFECTIVENESS_SUMMARY,
        },
      ],
    },
    {
      title: 'Cost Effectiveness',
      pages: [
        {
          title: 'Cost-effectiveness summary',
          description: 'View and download summary intervention cost-effectiveness estimates.',
          route: AppRoutes.INTERVENTION_REVIEW_COST_EFFECTIVENESS_SUMMARY,
        },
      ],
    },
  ];

  public getSections(interventionType: string) {
    if (interventionType === 'LSFF') {
      this.sections = this.lsFFsections;
    } else if (interventionType === 'BF') {
      this.sections = this.BfDSections;
    }
    return this.sections;
  }

  public getNextRoute(): AppRoute {
    return this.getRoute(this.currentStepPosition + 1);
  }

  public getNextRoutes(): { route: AppRoute; title: string }[] {
    const section = this.getSection(this.currentStepPosition);
    if (section && Object.prototype.hasOwnProperty.call(section, 'skip') && section.skip) {
      return section.skip.map((skip: string) => {
        const skipSection = this.sections.find((sec) => sec.title === skip);
        return { route: skipSection?.pages[0]?.route, title: `Confirm and continue to ${skip}` };
      });
    }

    return [{ route: this.getRoute(this.currentStepPosition + 1), title: 'Confirm and continue' }];
  }

  public getPreviousRoute(): AppRoute {
    if (this.previousStepPosition < this.currentStepPosition - 1) {
      return this.getRoute(this.previousStepPosition);
    } else {
      return this.getRoute(this.currentStepPosition - 1);
    }
  }

  public getSection(stepperPosition: number): { title: string; route: AppRoute; skip?: string[] } {
    let count = 0;
    let sect;
    this.sections.forEach((section) => {
      if (stepperPosition >= count && stepperPosition < count + section.pages.length) {
        sect = section.pages[stepperPosition - count];
      }
      count += section.pages.length;
    });
    return sect;
  }

  public getRoute(stepperPosition: number): AppRoute {
    let count = 0;
    let next: AppRoute;
    this.sections.forEach((section) => {
      if (stepperPosition >= count && stepperPosition < count + section.pages.length) {
        next = section.pages[stepperPosition - count].route;
      }
      count += section.pages.length;
    });
    return next;
  }

  public setCurrentStepperPosition(position: number, interventionType: string): void {
    this.currentInterventionType = interventionType;
    this.previousStepPosition = this.currentStepPosition;
    this.currentStepPosition = position;
    this.stepperPositionSrc.next(position);
  }

  public getPreviousStepperPosition(): number {
    return this.previousStepPosition;
  }
}
