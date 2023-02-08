import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../apiAndObjects/api/api.service';
import { Intervention } from '../apiAndObjects/objects/intervention';
import { InterventionBaselineAssumptions } from '../apiAndObjects/objects/interventionBaselineAssumptions';
import { InterventionCostSummary } from '../apiAndObjects/objects/interventionCostSummary';
import { InterventionData } from '../apiAndObjects/objects/interventionData';
import {
  FoodVehicleStandard,
  InterventionFoodVehicleStandards,
} from '../apiAndObjects/objects/interventionFoodVehicleStandards';
import { InterventionIndustryInformation } from '../apiAndObjects/objects/interventionIndustryInformation';
import { InterventionMonitoringInformation } from '../apiAndObjects/objects/interventionMonitoringInformation';
import { InterventionRecurringCosts } from '../apiAndObjects/objects/interventionRecurringCosts';
import { InterventionStartupCosts } from '../apiAndObjects/objects/interventionStartupCosts';
import { AppRoutes } from '../routes/routes';

export const ACTIVE_INTERVENTION_ID = 'activeInterventionId';
@Injectable({
  providedIn: 'root',
})
export class InterventionDataService {
  private cachedMnInPremix: Array<FoodVehicleStandard> = [];
  public ROUTES = AppRoutes;

  private readonly interventionSummaryChartPNGSrc = new BehaviorSubject<string>(null);
  public interventionSummaryChartPNGObs = this.interventionSummaryChartPNGSrc.asObservable();
  private readonly interventionSummaryChartPDFSrc = new BehaviorSubject<string>(null);
  public interventionSummaryChartPDFObs = this.interventionSummaryChartPDFSrc.asObservable();

  private readonly interventionDetailedChartPNGSrc = new BehaviorSubject<string>(null);
  public interventionDetailedChartPNGObs = this.interventionDetailedChartPNGSrc.asObservable();
  private readonly interventionDetailedChartPDFSrc = new BehaviorSubject<string>(null);
  public interventionDetailedChartPDFObs = this.interventionDetailedChartPDFSrc.asObservable();

  private readonly interventionDataChangesSrc = new BehaviorSubject<Record<string, unknown>>(null);
  public interventionDataChangesObs = this.interventionDataChangesSrc.asObservable();

  private readonly interventionStartupCostChangedSrc = new BehaviorSubject<boolean>(false);
  public interventionStartupCostChangedObs = this.interventionStartupCostChangedSrc.asObservable();
  private readonly interventionRecurringCostChangedSrc = new BehaviorSubject<boolean>(false);
  public interventionRecurringCostChangedObs = this.interventionRecurringCostChangedSrc.asObservable();

  constructor(private apiService: ApiService, private readonly router: Router, public route: ActivatedRoute) {}

  public getIntervention(id: string): Promise<Intervention> {
    return this.apiService.endpoints.intervention.getIntervention.call(
      {
        id,
      },
      false,
    );
  }
  public getInterventionData(id: string): Promise<InterventionData> {
    return this.apiService.endpoints.intervention.getInterventionData.call(
      {
        id,
      },
      false,
    );
  }
  public getInterventionFoodVehicleStandards(id: string): Promise<InterventionFoodVehicleStandards> {
    return this.apiService.endpoints.intervention.getInterventionFoodVehicleStandards.call(
      {
        id,
      },
      false,
    );
  }
  public getInterventionMonitoringInformation(id: string): Promise<InterventionMonitoringInformation> {
    return this.apiService.endpoints.intervention.getInterventionMonitoringInformation.call(
      {
        id,
      },
      false,
    );
  }
  public getInterventionIndustryInformation(id: string): Promise<InterventionIndustryInformation> {
    return this.apiService.endpoints.intervention.getInterventionIndustryInformation.call(
      {
        id,
      },
      false,
    );
  }
  public getInterventionRecurringCosts(id: string): Promise<InterventionRecurringCosts> {
    return this.apiService.endpoints.intervention.getInterventionRecurringCosts.call(
      {
        id,
      },
      false,
    );
  }
  public getInterventionStartupCosts(id: string): Promise<InterventionStartupCosts> {
    return this.apiService.endpoints.intervention.getInterventionStartupCosts.call(
      {
        id,
      },
      false,
    );
  }
  public getInterventionBaselineAssumptions(id: string): Promise<InterventionBaselineAssumptions> {
    return this.apiService.endpoints.intervention.getInterventionBaselineAssumptions.call(
      {
        id,
      },
      false,
    );
  }
  public getInterventionCostSummary(id: string): Promise<InterventionCostSummary> {
    return this.apiService.endpoints.intervention.getInterventionCostSummary.call(
      {
        id,
      },
      false,
    );
  }
  public setIntervention(
    parentInterventionId: number,
    newInterventionName: string,
    newInterventionDescription: string,
  ): Promise<Intervention> {
    return this.apiService.endpoints.intervention.postIntervention.call({
      parentInterventionId,
      newInterventionName,
      newInterventionDescription,
    });
  }

  public setInterventionSummaryChartPNG(chart: string): void {
    this.interventionSummaryChartPNGSrc.next(chart);
  }
  public setInterventionSummaryChartPDF(chart: string): void {
    this.interventionSummaryChartPDFSrc.next(chart);
  }

  public setInterventionDetailedChartPNG(chart: string): void {
    this.interventionDetailedChartPNGSrc.next(chart);
  }
  public setInterventionDetailedChartPDF(chart: string): void {
    this.interventionDetailedChartPDFSrc.next(chart);
  }

  public interventionStartupCostChanged(source: boolean): void {
    this.interventionStartupCostChangedSrc.next(source);
  }

  public interventionRecurringCostChanged(source: boolean): void {
    this.interventionRecurringCostChangedSrc.next(source);
  }

  public getCachedMnInPremix(): Array<FoodVehicleStandard> | null {
    const ls = localStorage.getItem('cachedMnInPremix');
    const cached = JSON.parse(ls);
    return cached;
  }

  public getMnInPremixCount(): number {
    const ls = localStorage.getItem('cachedMnInPremix');
    const cached = JSON.parse(ls);

    if (cached) {
      return cached.length;
    } else {
      return 0;
    }
  }

  public addMnToCachedMnInPremix(items: Array<FoodVehicleStandard>): void {
    const ls = localStorage.getItem('cachedMnInPremix');
    const cached = JSON.parse(ls);

    if (cached) {
      switch (true) {
        case cached.length > 0:
          this.cachedMnInPremix = cached.concat(items);
          break;
        case cached.length === 0:
          this.cachedMnInPremix = items;
          break;
        default:
          this.cachedMnInPremix = [];
      }
    } else {
      this.cachedMnInPremix = this.cachedMnInPremix.concat(items);
    }

    localStorage.setItem('cachedMnInPremix', JSON.stringify(this.cachedMnInPremix));
  }

  public removeMnFromCachedMnInPremix(item: FoodVehicleStandard): Array<FoodVehicleStandard> {
    this.cachedMnInPremix = this.cachedMnInPremix.filter((mnItem: FoodVehicleStandard) => {
      return mnItem !== item;
    });
    localStorage.setItem('cachedMnInPremix', JSON.stringify(this.cachedMnInPremix));
    return this.cachedMnInPremix;
  }

  public setActiveInterventionId(id: string): void {
    localStorage.removeItem(ACTIVE_INTERVENTION_ID);
    localStorage.setItem(ACTIVE_INTERVENTION_ID, id);
  }

  public getActiveInterventionId(): string {
    const activeId = localStorage.getItem(ACTIVE_INTERVENTION_ID);
    if (null == activeId) {
      const route = this.ROUTES.QUICK_MAPS_COST_EFFECTIVENESS.getRoute();
      const params = this.route.snapshot.queryParams;
      void this.router.navigate(route, { queryParams: params });
    } else {
      return activeId;
    }
  }

  public startReviewingIntervention(interventionID: string): void {
    this.setActiveInterventionId(interventionID);
    const route = this.ROUTES.INTERVENTION_REVIEW_BASELINE.getRoute();
    const params = this.route.snapshot.queryParams;
    void this.router.navigate(route, { queryParams: params });
  }

  public patchInterventionData(
    interventionId: string,
    data: Array<Record<string, unknown>>,
  ): Promise<InterventionData> {
    return this.apiService.endpoints.intervention.patchInterventionData.call({ interventionId, data });
  }

  public setInterventionDataChanges(data: Record<string, unknown>): void {
    this.interventionDataChangesSrc.next(data);
  }

  public getInterventionDataChanges(): Record<string, unknown> {
    return this.interventionDataChangesSrc.value;
  }

  public interventionPageConfirmContinue(): Promise<void> {
    const interventionChanges = this.getInterventionDataChanges();
    if (interventionChanges) {
      const dataArr = [];
      for (const key in interventionChanges) {
        dataArr.push(interventionChanges[key]);
      }

      const interventionId = this.getActiveInterventionId();
      return this.patchInterventionData(interventionId, dataArr).then(() => {
        this.setInterventionDataChanges(null);
      });
    } else {
      return;
    }
  }
}

export interface InterventionForm {
  formChanges: {
    [row: number]: {
      [col: string]: string;
    };
  };
}
