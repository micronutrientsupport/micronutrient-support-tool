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
import { pairwise, map, filter, startWith } from 'rxjs/operators';
import { SimpleIntervention } from '../pages/costEffectiveness/intervention';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { InterventionProjectedHouseholds } from '../apiAndObjects/objects/interventionProjectedHouseholds';
import { InterventionIntakeThreshold } from '../apiAndObjects/objects/interventionIntakeThreshold';
import { InterventionExpectedLosses } from '../apiAndObjects/objects/interventionExpectedLosses';
import { InterventionLsffEffectivenessSummary } from '../apiAndObjects/objects/interventionLsffEffectivenessSummary';
import { InterventionCostEffectivenessSummary } from '../apiAndObjects/objects/interventionCostEffectivenessSummary';
import { InterventionStatus } from '../apiAndObjects/objects/interventionStatus';

export const ACTIVE_INTERVENTION_ID = 'activeInterventionId';
export const CACHED_MN_IN_PREMIX = 'cachedMnInPremix';
// export const RECENT_INTERVENTIONS = 'recentInterventions';
export const RECENT_INTERVENTIONS_SIMPLE = 'recentUserInterventions';
@Injectable({
  providedIn: 'root',
})
export class InterventionDataService {
  private cachedSelectedCompounds: Record<number, FoodVehicleCompound> = {};
  public ROUTES = AppRoutes;

  private interventionPremixMns: string[] = [];

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

  private readonly interventionPremixCostChangedSrc = new BehaviorSubject<boolean>(false);
  public interventionPremixCostChangedObs = this.interventionPremixCostChangedSrc.asObservable();

  private readonly simpleInterventionArrChangedSrc = new BehaviorSubject<Array<SimpleIntervention>>(
    this.getSimpleInterventionsFromStorage(),
  );
  public simpleInterventionArrChangedObs = this.simpleInterventionArrChangedSrc.asObservable();

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

  public getInterventionExpectedLosses(id: string): Promise<InterventionExpectedLosses> {
    return this.apiService.endpoints.intervention.getInterventionExpectedLosses.call(
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

  public getInterventionCostEffectivenessSummary(id: string): Promise<InterventionCostEffectivenessSummary> {
    return this.apiService.endpoints.intervention.getInterventionCostEffectivenessSummary.call(
      {
        id,
      },
      false,
    );
  }

  public getInterventionProjectedHouseholds(id: string): Promise<InterventionProjectedHouseholds[]> {
    return this.apiService.endpoints.intervention.getInterventionProjectedHouseholds.call(
      {
        id,
      },
      false,
    );
  }

  public getInterventionLsffEffectivenessSummary(
    id: string,
    aggregation?: string,
    metric?: string,
  ): Promise<InterventionLsffEffectivenessSummary[]> {
    return this.apiService.endpoints.intervention.getInterventionLsffEffectivenessSummary.call(
      {
        id: id,
        aggregation: aggregation,
        metric: metric,
      },
      false,
    );
  }

  public getInterventionIntakeThreshold(id: string): Promise<InterventionIntakeThreshold[]> {
    return this.apiService.endpoints.intervention.getInterventionIntakeThreshold.call(
      {
        id,
      },
      false,
    );
  }

  public getInterventionStatusDictionary(): Promise<InterventionStatus[]> {
    return this.apiService.endpoints.intervention.getInterventionStatusDictionary.call(null, false);
  }

  public setIntervention(
    parentInterventionId: number,
    newInterventionName: string,
    newInterventionDescription: string,
    newInterventionNation?: string,
    newInterventionFocusGeography?: string,
    newInterventionFocusMicronutrient?: string,
    newInterventionNature?: number,
    newInterventionStatus?: number,
  ): Promise<Intervention> {
    return this.apiService.endpoints.intervention.postIntervention.call({
      parentInterventionId,
      newInterventionName,
      newInterventionDescription,
      newInterventionNation,
      newInterventionFocusGeography,
      newInterventionFocusMicronutrient,
      newInterventionNature,
      newInterventionStatus,
    });
  }

  public getSimpleInterventionsFromStorage(): Array<SimpleIntervention> {
    const itemsArr = localStorage.getItem(RECENT_INTERVENTIONS_SIMPLE)
      ? (JSON.parse(localStorage.getItem(RECENT_INTERVENTIONS_SIMPLE)) as Array<SimpleIntervention>)
      : [];
    return itemsArr;
  }

  public clearMicronutrientInPremix() {
    this.interventionPremixMns = [];
  }

  public addMicronutrientInPremix(micronutrient: string) {
    this.interventionPremixMns.push(micronutrient);
  }

  public getMicronutrientInPremix() {
    return this.interventionPremixMns;
  }

  public setSimpleInterventionInStorage(intervention: Intervention) {
    const activeItemsArr = this.getSimpleInterventionsFromStorage();
    const simpleIntervention: SimpleIntervention = {
      name: intervention.name,
      id: intervention.id,
      baseYear: intervention.baseYear,
      totalCost: intervention.tenYearTotalCost,
      description: intervention.description,
      lastEdited: intervention.lastEdited,
      userId: intervention.userId,
      focusMicronutrient: intervention.focusMicronutrient,
      focusNation: intervention.countryId,
    };
    const testDuplicate = activeItemsArr.find((activeItem: SimpleIntervention) => activeItem.id === intervention.id);

    if (null == testDuplicate) {
      activeItemsArr.push(simpleIntervention);
      localStorage.setItem(RECENT_INTERVENTIONS_SIMPLE, JSON.stringify(activeItemsArr));
      this.simpleInterventionArrChangedSrc.next(activeItemsArr);
    }
  }

  public removeSimpleInterventionFromStorage(interventionToRemove: SimpleIntervention) {
    const activeInterventions = this.getSimpleInterventionsFromStorage();
    const newArr = activeInterventions.filter(
      (intervention: SimpleIntervention) => intervention.id !== interventionToRemove.id,
    );
    localStorage.setItem(RECENT_INTERVENTIONS_SIMPLE, JSON.stringify(newArr));
    this.simpleInterventionArrChangedSrc.next(newArr);
  }

  // This function can be used to update the intervention list when a user logs in or out.
  public triggerSimpleInterventionRefresh() {
    this.simpleInterventionArrChangedSrc.next(this.getSimpleInterventionsFromStorage());
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

  public interventionPremixCostChanged(source: boolean): void {
    this.interventionPremixCostChangedSrc.next(source);
  }

  public getCachedSelectedCompoundsInMn(): Record<number, FoodVehicleCompound> {
    const ls = localStorage.getItem('cachedSelectedCompoundsInPremix');
    const cached = JSON.parse(ls);
    return cached;
  }

  public addSelectedCompoundsToCachedPremix(compound: FoodVehicleCompound, index: number): void {
    this.cachedSelectedCompounds[index] = compound;
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
      const route = this.ROUTES.COST_EFFECTIVENESS.getRoute();
      const params = this.route.snapshot.queryParams;
      void this.router.navigate(route, { queryParams: params });
    } else {
      return activeId;
    }
  }

  // public getRecentInterventions(): Array<InterventionsDictionaryItem> {
  //   //changed RECENT_INTERVENTIONS to RECENT_INTERVENTIONS_SIMPLE
  //   const ls = localStorage.getItem(RECENT_INTERVENTIONS);
  //   const cached = JSON.parse(ls) as Array<InterventionsDictionaryItem>;
  //   if (cached) {
  //     return cached;
  //   } else {
  //     return [];
  //   }
  // }

  // public updateRecentInterventions(intervention: InterventionsDictionaryItem): void {
  //   const intID = intervention.id.toString();
  //   // TODO: Bug somewhere in system which is returning interventionId as an number.
  //   const cached = this.getRecentInterventions();
  //   const exists =
  //     cached.filter((intervention: InterventionsDictionaryItem) => intervention.id.toString() === intID).length > 0;
  //   if (!exists) {
  //     if (cached.length < 5) {
  //       // Checks if intervention already exists in RECENT_INTERVENTIONS array.
  //       cached.push(intervention);
  //     } else {
  //       cached.shift(); // Removes chronologically oldest item in array.
  //       cached.push(intervention);
  //     }
  //   }
  //   //changed RECENT_INTERVENTIONS to RECENT_INTERVENTIONS_SIMPLE
  //   localStorage.setItem(RECENT_INTERVENTIONS, JSON.stringify(cached));
  // }

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

  public async interventionPageConfirmContinue(): Promise<void> {
    const interventionChanges = this.getInterventionDataChanges();
    if (interventionChanges) {
      // console.log(interventionChanges);
      const dataArr = [];
      for (const key in interventionChanges) {
        if (key.startsWith('F')) {
          const change = interventionChanges[key];
          (change as any).rowIndex = Number(key.substring(1));
          (change as any).type = 'premix';
        } else if (key.startsWith('global')) {
          const change = interventionChanges[key];
          (change as any).rowIndex = 0;
          (change as any).type = 'premix-global';
        } else if (key.startsWith('thresholds')) {
          const change = interventionChanges[key];
          (change as any).rowIndex = 0;
          (change as any).type = 'intervention-thresholds';
        } else {
          (interventionChanges[key] as any).type = 'data';
        }
        if (
          Object.prototype.hasOwnProperty.call(interventionChanges[key], 'year0') &&
          isNaN((interventionChanges[key] as any).year0)
        ) {
          console.error('NaN data!');
        } else {
          dataArr.push(interventionChanges[key]);
        }
      }

      const interventionId = this.getActiveInterventionId();
      const res = await this.patchInterventionData(interventionId, dataArr);
      // console.log('Patched', res);
      this.setInterventionDataChanges(null);
      // return this.patchInterventionData(interventionId, dataArr).then((res) => {
      //   console.log('Patched', res)

      // });
      return;
    } else {
      return;
    }
  }

  public setNewMicronutrientInPremix(micronutrient: MicronutrientDictionaryItem | null): void {
    this.newMicronutrientInPremix.next(micronutrient);
  }

  public setFormFieldState(form: UntypedFormGroup, dirtyIndexes?: number[], field?: string) {
    form.controls.items['controls'].forEach((formRow: FormGroup, rowIndex: number) => {
      let yearIndex = 0;
      Object.keys(formRow.controls).forEach((key: string) => {
        if (field && key === field) {
          // console.log({ key });
          // console.log({
          //   editable: formRow.controls['isEditable'].value,
          //   calculated: formRow.controls['isCalculated'].value,
          //   edited: formRow.controls[field + 'Edited'].value,
          // });
          if (formRow.controls['isEditable'].value === false) {
            formRow.controls[key].disable(); // disabling control removes its value, for some reason
          }
          if (formRow.controls['isCalculated'].value === false && formRow.controls[field + 'Edited'].value == true) {
            formRow.controls[key].markAsDirty(); // mark field as ng-dirty i.e. user edited
            if (dirtyIndexes) {
              dirtyIndexes.push(rowIndex);
            } // mark row as containing user info
          }
          if (formRow.controls['isCalculated'].value === true && formRow.controls[field + 'Overriden'].value == true) {
            formRow.controls[key].markAsTouched(); // mark field as ng-dirty and ng-touced i.e a calculated value which has been overridden
            formRow.controls[key].markAsDirty();
            if (dirtyIndexes) {
              dirtyIndexes.push(rowIndex);
            } // mark row as containing user info
          }
        } else if (key === 'year' + yearIndex) {
          if (formRow.controls['isEditable'].value === false) {
            formRow.controls[key].disable(); // disabling control removes its value, for some reason
          }
          if (
            formRow.controls['isCalculated'].value === false &&
            formRow.controls['year' + yearIndex + 'Edited'].value === true
          ) {
            formRow.controls[key].markAsDirty(); // mark field as ng-dirty i.e. user edited
            if (dirtyIndexes) {
              dirtyIndexes.push(rowIndex);
            } // mark row as containing user info
          }
          if (
            formRow.controls['isCalculated'].value === true &&
            formRow.controls['year' + yearIndex + 'Overriden'].value === true
          ) {
            formRow.controls[key].markAsTouched(); // mark field as ng-dirty and ng-touced i.e a calculated value which has been overridden
            formRow.controls[key].markAsDirty();
            if (dirtyIndexes) {
              dirtyIndexes.push(rowIndex);
            } // mark row as containing user info
          }
          yearIndex++;
        }
      });
      // console.log({ dirtyIndexes });
    });
  }

  public resetForm(form: UntypedFormGroup, dirtyIndexes?: number[]) {
    // set fields to default values as delivered per api
    form.controls.items['controls'].forEach((formRow: FormGroup) => {
      let yearIndex = 0;
      Object.keys(formRow.controls).forEach((key: string) => {
        if (key === 'year' + yearIndex) {
          switch (formRow.controls['rowUnits'].value) {
            case 'percent':
              if (
                formRow.controls['year' + yearIndex + 'Default'].value * 100 !==
                formRow.controls['year' + yearIndex].value
              ) {
                formRow.controls[key].setValue(formRow.controls['year' + yearIndex + 'Default'].value * 100); // set the value in 1-100 scale
              }
              break;
            default:
              if (
                formRow.controls['year' + yearIndex + 'Default'].value !== formRow.controls['year' + yearIndex].value
              ) {
                formRow.controls[key].setValue(formRow.controls['year' + yearIndex + 'Default'].value); // set the default value
              }
          }
          yearIndex++;
        }
      });
    });
    //on reset mark forma as pristine to remove blue highlights
    form.markAsPristine();
    form.markAsUntouched();
    //remove dirty indexes to reset button to GFDx input
    if (dirtyIndexes) {
      dirtyIndexes.splice(0);
    }
  }

  private reverseFormatNumber(val, locale) {
    const group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, '');
    const decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, '');
    let reversedVal = val.replace(new RegExp('\\' + group, 'g'), '');
    reversedVal = reversedVal.replace(new RegExp('\\' + decimal, 'g'), '.');
    return Number.isNaN(reversedVal) ? 0 : reversedVal;
  }

  public formatPlain(value: string) {
    if (value.startsWith('$')) {
      const plainCurrency = this.reverseFormatNumber(value.substr(1), 'en-US');
      //console.log(`${value} -> ${plainCurrency}`);
      return Number(plainCurrency);
    }
    return Number(value);
  }

  public initFormChangeWatcher(form: UntypedFormGroup, formChanges: InterventionForm['formChanges'] = {}) {
    const compareObjs = (a: Record<string, unknown>, b: Record<string, unknown>) => {
      return Object.entries(b).filter(([key, value]) => value !== a[key]);
    };
    const changes = {};

    form.valueChanges
      .pipe(
        startWith(form.value),
        pairwise(),
        map(([oldState, newState]) => {
          console.log({ oldState, newState });
          for (const key in newState.items) {
            const rowIndex = form.get('items')['controls'][key]['controls'].rowIndex.value;
            let rowUnits = form.get('items')['controls'][key]['controls'].rowUnits.value;
            if (oldState.items[key] !== newState.items[key] && oldState.items[key] !== undefined) {
              const diff = compareObjs(oldState.items[key], newState.items[key]);

              if (Array.isArray(diff) && diff.length > 0) {
                diff.forEach((item) => {
                  // Check for alternative row units set for this specific control
                  const altUnits = form.controls.items['controls'][key].controls[item[0] + 'Units']?.value;
                  if (altUnits) {
                    rowUnits = altUnits;
                  }

                  const cellIsOverriden = !form.controls.items['controls'][key].controls[item[0]].pristine;
                  const rowIsCalculated = newState.items[key]['isCalculated'];

                  // Only send changes for user editible, non-calculated fields (or overridden)
                  if (!rowIsCalculated || cellIsOverriden || item[0].endsWith('Overriden')) {
                    // if (!rowIsCalculated || cellIsOverriden || item[0].endsWith('Overriden')) {
                    if (rowUnits === 'percent') {
                      if (changes[rowIndex]) {
                        changes[rowIndex] = {
                          ...changes[rowIndex],
                          [item[0]]: Number(item[1]) / 100,
                        };
                        changes[rowIndex]['rowIndex'] = rowIndex;
                      } else {
                        changes[rowIndex] = {
                          [item[0]]: Number(item[1]) / 100,
                        };
                        changes[rowIndex]['rowIndex'] = rowIndex;
                      }
                    } else if (rowUnits === 'US dollars') {
                      if (changes[rowIndex]) {
                        changes[rowIndex] = {
                          ...changes[rowIndex],
                          [item[0]]: this.formatPlain(item[1] as string),
                        };
                        changes[rowIndex]['rowIndex'] = rowIndex;
                      } else {
                        changes[rowIndex] = {
                          [item[0]]: this.formatPlain(item[1] as string),
                        };
                        changes[rowIndex]['rowIndex'] = rowIndex;
                      }
                    } else {
                      if (changes[rowIndex]) {
                        changes[rowIndex] = {
                          ...changes[rowIndex],
                          [item[0]]: Number(item[1]),
                        };
                        changes[rowIndex]['rowIndex'] = rowIndex;
                      } else {
                        changes[rowIndex] = {
                          [item[0]]: Number(item[1]),
                        };
                        changes[rowIndex]['rowIndex'] = rowIndex;
                      }
                    }
                  }
                });
              }
            }
          }
          console.log({ changes });
          return changes;
        }),
        filter((changes) => Object.keys(changes).length !== 0 && !form.invalid),
      )
      .subscribe((value) => {
        formChanges = value;
        // console.log('newChanges', formChanges);
        const newInterventionChanges = {
          ...this.getInterventionDataChanges(),
          ...formChanges,
        };
        this.setInterventionDataChanges(newInterventionChanges);
      });
  }
}

export interface InterventionForm {
  formChanges: {
    [row: number]: {
      [col: string]: string;
    };
  };
}
