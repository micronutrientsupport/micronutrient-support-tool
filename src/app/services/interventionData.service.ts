import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../apiAndObjects/api/api.service';
import { Intervention } from '../apiAndObjects/objects/intervention';
import { InterventionBaselineAssumptions } from '../apiAndObjects/objects/interventionBaselineAssumptions';
import { InterventionCostSummary } from '../apiAndObjects/objects/interventionCostSummary';
import { InterventionData } from '../apiAndObjects/objects/interventionData';
import { InterventionFoodVehicleStandards } from '../apiAndObjects/objects/interventionFoodVehicleStandards';
import { InterventionIndustryInformation } from '../apiAndObjects/objects/interventionIndustryInformation';
import { InterventionMonitoringInformation } from '../apiAndObjects/objects/interventionMonitoringInformation';
import { InterventionRecurringCosts } from '../apiAndObjects/objects/interventionRecurringCosts';
import { InterventionStartupCosts } from '../apiAndObjects/objects/interventionStartupCosts';

@Injectable({
  providedIn: 'root',
})
export class InterventionDataService {
  private readonly interventionSummaryChartPNGSrc = new BehaviorSubject<string>(null);
  public interventionSummaryChartPNGObs = this.interventionSummaryChartPNGSrc.asObservable();
  private readonly interventionSummaryChartPDFSrc = new BehaviorSubject<string>(null);
  public interventionSummaryChartPDFObs = this.interventionSummaryChartPDFSrc.asObservable();

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

  public setInterventionSummaryChartPNG(chart: string): void {
    this.interventionSummaryChartPNGSrc.next(chart);
  }
  public setInterventionSummaryChartPDF(chart: string): void {
    this.interventionSummaryChartPDFSrc.next(chart);
  }

  constructor(private apiService: ApiService) {}
}
