import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ApiService } from '../apiAndObjects/api/api.service';
import { MicronutrientDictionaryItem } from '../apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { Intervention } from '../apiAndObjects/objects/intervention';
import { InterventionBaselineAssumptions } from '../apiAndObjects/objects/interventionBaselineAssumptions';
import { InterventionCostSummary } from '../apiAndObjects/objects/interventionCostSummary';
import { InterventionData } from '../apiAndObjects/objects/interventionData';
import {
  FoodVehicleCompound,
  FoodVehicleStandard,
  InterventionFoodVehicleStandards,
} from '../apiAndObjects/objects/interventionFoodVehicleStandards';
import { InterventionIndustryInformation } from '../apiAndObjects/objects/interventionIndustryInformation';
import { InterventionMonitoringInformation } from '../apiAndObjects/objects/interventionMonitoringInformation';
import { InterventionRecurringCosts } from '../apiAndObjects/objects/interventionRecurringCosts';
import { InterventionStartupCosts } from '../apiAndObjects/objects/interventionStartupCosts';
import { AppRoutes } from '../routes/routes';
import { InterventionsDictionaryItem } from '../apiAndObjects/objects/dictionaries/interventionDictionaryItem';

export const ACTIVE_INTERVENTION_ID = 'activeInterventionId';
export const CACHED_MN_IN_PREMIX = 'cachedMnInPremix';
export const RECENT_INTERVENTIONS = 'recentInterventions';
@Injectable({
  providedIn: 'root',
})
export class InterventionDataService {
  private cachedMnInPremix: Array<FoodVehicleStandard> = [];
  private cachedSelectedCompounds: Record<number, FoodVehicleCompound | Record<string, unknown>> = {};
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

  private readonly newMicronutrientInPremix = new ReplaySubject<MicronutrientDictionaryItem>();
  public newMicronutrientInPremixObs = this.newMicronutrientInPremix.asObservable();

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
    newInterventionNation?: string,
    newInterventionFocusGeography?: string,
    newInterventionFocusMicronutrient?: string,
  ): Promise<Intervention> {
    return this.apiService.endpoints.intervention.postIntervention.call({
      parentInterventionId,
      newInterventionName,
      newInterventionDescription,
      newInterventionNation,
      newInterventionFocusGeography,
      newInterventionFocusMicronutrient,
    });
  }

  public claimAnonymousIntervention(id: string): Promise<Intervention> {
    return this.apiService.endpoints.intervention.patchIntervention.call({ id });
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

  public getCachedSelectedCompoundsInMn(): Record<number, FoodVehicleCompound | Record<string, unknown>> {
    const ls = localStorage.getItem('cachedSelectedCompoundsInPremix');
    const cached = JSON.parse(ls);
    return cached;
  }

  public addSelectedCompoundsToCachedPremix(
    items: Record<number, FoodVehicleCompound | Record<string, unknown>>,
  ): void {
    const ls = localStorage.getItem('cachedSelectedCompoundsInPremix');
    const cached = JSON.parse(ls);

    if (cached) {
      Object.keys(items).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(cached, key)) {
          this.cachedSelectedCompounds = { ...cached, ...items[key] };
        }
      });
    } else {
      this.cachedSelectedCompounds = { ...items };
    }
    localStorage.setItem('cachedSelectedCompoundsInPremix', JSON.stringify(this.cachedSelectedCompounds));
  }

  public getCachedMnInPremix(): Array<FoodVehicleStandard> | null {
    const ls = localStorage.getItem(`${CACHED_MN_IN_PREMIX}:${this.getActiveInterventionId()}`);
    const cached = JSON.parse(ls);
    return cached;
  }

  public getMnInPremixCount(): number {
    const ls = localStorage.getItem(`${CACHED_MN_IN_PREMIX}:${this.getActiveInterventionId()}`);
    const cached = JSON.parse(ls);

    if (cached) {
      return cached.length;
    } else {
      return 0;
    }
  }

  public addMnToCachedMnInPremix(items: Array<FoodVehicleStandard>): void {
    const cached = this.getCachedMnInPremix();
    let cachedMnInPremix = [];

    if (cached) {
      switch (true) {
        case cached.length > 0:
          cachedMnInPremix = cached.concat(items);
          break;
        case cached.length === 0:
          cachedMnInPremix = items;
          break;
        default:
          cachedMnInPremix = [];
      }
    } else {
      cachedMnInPremix = cachedMnInPremix.concat(items);
    }
    localStorage.setItem(`${CACHED_MN_IN_PREMIX}:${this.getActiveInterventionId()}`, JSON.stringify(cachedMnInPremix));
  }

  public updateMnCachedInPremix(item: FoodVehicleStandard) {
    const cached = this.getCachedMnInPremix();
    if (cached) {
      const itemToUpdate = cached.find((value) => value.micronutrient === item.micronutrient);
      const index = cached.indexOf(itemToUpdate);
      cached[index] = item;
      cached;
      localStorage.setItem(`${CACHED_MN_IN_PREMIX}:${this.getActiveInterventionId()}`, JSON.stringify(cached));
    }
  }

  public removeMnFromCachedMnInPremix(item: FoodVehicleStandard): Array<FoodVehicleStandard> {
    const ls = localStorage.getItem(`${CACHED_MN_IN_PREMIX}:${this.getActiveInterventionId()}`);
    let cached = JSON.parse(ls);

    if (cached) {
      if (cached.length === 1) {
        cached = [];
      } else {
        cached = cached.filter((mnItem: FoodVehicleStandard) => {
          return mnItem.micronutrient !== item.micronutrient;
        });
      }

      localStorage.setItem(`${CACHED_MN_IN_PREMIX}:${this.getActiveInterventionId()}`, JSON.stringify(cached));
    }
    return cached;
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

  public getRecentInterventions(): Array<InterventionsDictionaryItem> {
    const ls = localStorage.getItem(RECENT_INTERVENTIONS);
    const cached = JSON.parse(ls) as Array<InterventionsDictionaryItem>;
    if (cached) {
      return cached;
    } else {
      return [];
    }
  }

  public updateRecentInterventions(intervention: InterventionsDictionaryItem): void {
    const intID = intervention.id.toString();
    // TODO: Bug somewhere in system which is returning interventionId as an number.
    const cached = this.getRecentInterventions();
    const exists =
      cached.filter((intervention: InterventionsDictionaryItem) => intervention.id.toString() === intID).length > 0;
    if (!exists) {
      if (cached.length < 5) {
        // Checks if intervention already exists in RECENT_INTERVENTIONS array.
        cached.push(intervention);
      } else {
        cached.shift(); // Removes chronologically oldest item in array.
        cached.push(intervention);
      }
    }
    localStorage.setItem(RECENT_INTERVENTIONS, JSON.stringify(cached));
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
    console.log(interventionChanges);
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

  public setNewMicronutrientInPremix(micronutrient: MicronutrientDictionaryItem | null): void {
    this.newMicronutrientInPremix.next(micronutrient);
  }
}

export interface InterventionForm {
  formChanges: {
    [row: number]: {
      [col: string]: string;
    };
  };
}
