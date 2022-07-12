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

  private readonly interventionDataChangesSrc = new BehaviorSubject<unknown>(null);
  public interventionDataChangesObs = this.interventionDataChangesSrc.asObservable();


  constructor(private apiService: ApiService, private readonly router: Router, public route: ActivatedRoute) { }

  public getIntervention(id: string): Promise<Intervention> {
    return this.apiService.endpoints.intervention.getIntervention.call({
      id,
    });
  }
  public getInterventionData(id: string): Promise<InterventionData> {
    return this.apiService.endpoints.intervention.getInterventionData.call({
      id,
    });
  }
  public getInterventionFoodVehicleStandards(id: string): Promise<InterventionFoodVehicleStandards> {
    return this.apiService.endpoints.intervention.getInterventionFoodVehicleStandards.call({
      id,
    });
  }
  public getInterventionMonitoringInformation(id: string): Promise<InterventionMonitoringInformation> {
    return this.apiService.endpoints.intervention.getInterventionMonitoringInformation.call({
      id,
    });
  }
  public getInterventionIndustryInformation(id: string): Promise<InterventionIndustryInformation> {
    return this.apiService.endpoints.intervention.getInterventionIndustryInformation.call({
      id,
    });
  }
  public getInterventionRecurringCosts(id: string): Promise<InterventionRecurringCosts> {
    return this.apiService.endpoints.intervention.getInterventionRecurringCosts.call({
      id,
    });
  }
  public getInterventionStartupCosts(id: string): Promise<InterventionStartupCosts> {
    return this.apiService.endpoints.intervention.getInterventionStartupCosts.call({
      id,
    });
  }
  public getInterventionBaselineAssumptions(id: string): Promise<InterventionBaselineAssumptions> {
    return this.apiService.endpoints.intervention.getInterventionBaselineAssumptions.call({
      id,
    });
  }
  public getInterventionCostSummary(id: string): Promise<InterventionCostSummary> {
    return this.apiService.endpoints.intervention.getInterventionCostSummary.call({
      id,
    });
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

  public getCachedMnInPremix(): Array<FoodVehicleStandard> {
    return this.cachedMnInPremix;
  }

  public getMnInPremixCount(): number {
    return this.cachedMnInPremix.length;
  }

  public addMnToCachedMnInPremix(items: Array<FoodVehicleStandard>): void {
    this.cachedMnInPremix = this.cachedMnInPremix.concat(items);
  }

  public removeMnFromCachedMnInPremix(item: FoodVehicleStandard): Array<FoodVehicleStandard> {
    this.cachedMnInPremix = this.cachedMnInPremix.filter((mnItem: FoodVehicleStandard) => {
      return mnItem !== item;
    });
    return this.cachedMnInPremix;
  }

  public setActiveInterventionId(id: string): void {
    localStorage.removeItem(ACTIVE_INTERVENTION_ID);
    localStorage.setItem(ACTIVE_INTERVENTION_ID, id);
  }

  public getActiveInterventionId(): string {
    const activeId = localStorage.getItem(ACTIVE_INTERVENTION_ID);
    console.debug('aactiveId from service', activeId);
    if (null == activeId) {
      const route = this.ROUTES.QUICK_MAPS_COST_EFFECTIVENESS.getRoute();
      const params = this.route.snapshot.queryParams;
      void this.router.navigate(route, { queryParams: params });
    } else {
      return activeId;
    }
  }

  public patchInterventionData(interventionId: string, data: Array<Record<string, unknown>>): Promise<InterventionData> {
    return this.apiService.endpoints.intervention.patchInterventionData.call({ interventionId, data });
  }

  setIndustryInformationChanges(data: unknown): void {
    this.interventionDataChangesSrc.next(data)
  }

  getIndustryInformationChanges(): unknown {
    return this.interventionDataChangesSrc.value
  }
}
