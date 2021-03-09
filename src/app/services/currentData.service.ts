import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { MicronutrientDictionaryItem } from '../apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { DietarySource } from '../apiAndObjects/objects/dietarySource';
import { MicronutrientMeasureType } from '../apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { HouseholdHistogramData } from '../apiAndObjects/objects/householdHistogramData';
import { MicronutrientDataOption } from '../apiAndObjects/objects/micronutrientDataOption';
import { MonthlyFoodGroups } from '../apiAndObjects/objects/monthlyFoodGroups';
import { ProjectedAvailability } from '../apiAndObjects/objects/projectedAvailability';
import { ProjectedFoodSourcesData } from '../apiAndObjects/objects/projectedFoodSources';
import { SubRegionDataItem } from '../apiAndObjects/objects/subRegionDataItem';
import { TopFoodSource } from '../apiAndObjects/objects/topFoodSource';
import { DictionaryItem } from '../apiAndObjects/_lib_code/objects/dictionaryItem.interface';
import { DictionaryService } from './dictionary.service';

@Injectable()
export class CurrentDataService {
  constructor(
    private apiService: ApiService,
    private dictService: DictionaryService,
  ) {
    // TEST
    // void this.apiService.endpoints.currentData.getMonthlyFoodGroups.call({
    //   countryOrGroupId: '',
    //   micronutrientIds: [],
    //   mndsDataId: '',
    // }).then(data => console.debug(data));
  }

  public getMicronutrientDataOptions(
    countryOrgroup: DictionaryItem | string,
    measureType: MicronutrientMeasureType,
    singleOptionOnly: boolean,
  ): Promise<Array<MicronutrientDataOption>> {
    return this.apiService.endpoints.currentData.getMicronutrientDataOptions.call({
      countryOrGroupId: 'string' === typeof countryOrgroup ? countryOrgroup : countryOrgroup.id,
      measureType,
      singleOptionOnly,
    });
  }

  public getSubRegionData(
    countryOrGroupId: string,
    micronutrients: Array<MicronutrientDictionaryItem>,
    mndsDataId: string,
  ): Promise<Array<SubRegionDataItem>> {
    return this.apiService.endpoints.currentData.getSubRegionData.call({
      countryOrGroupId,
      micronutrients,
      mndsDataId,
    });
  }

  public getDietarySources(
    countryOrGroupId: string,
    micronutrients: Array<MicronutrientDictionaryItem>,
    mndsDataId: string,
  ): Promise<Array<DietarySource>> {
    return this.apiService.endpoints.currentData.getDietarySources.call({
      countryOrGroupId,
      micronutrients,
      mndsDataId,
    });
  }

  public getTopFood(
    countryOrGroupId: string,
    micronutrients: Array<MicronutrientDictionaryItem>,
    // mndsDataId: string,
  ): Promise<Array<TopFoodSource>> {
    return this.apiService.endpoints.currentData.getTopFood.call({
      countryOrGroupId,
      micronutrients,
      // mndsDataId,
    });
  }

  public getHouseholdHistogramData(
    countryOrGroupId: string,
    micronutrients: Array<MicronutrientDictionaryItem>,
    mndsDataId: string,
  ): Promise<HouseholdHistogramData> {
    return this.apiService.endpoints.currentData.getHouseholdHistogramData.call({
      countryOrGroupId,
      micronutrients,
      mndsDataId,
    });
  }

  public getProjectedFoodSourceData(
    countryOrGroupId: string,
    micronutrientId: string,
    scenarioId: string,
  ): Promise<Array<ProjectedFoodSourcesData>> {
    return this.apiService.endpoints.currentData.getProjectedFoodSourcesData.call({
      countryOrGroupId,
      micronutrientId,
      scenarioId,
    });
  }

  public getMonthlyFoodGroups(
    countryOrGroupId: string,
    micronutrients: Array<MicronutrientDictionaryItem>,
    mndsDataId: string,
  ): Promise<MonthlyFoodGroups> {
    return this.apiService.endpoints.currentData.getMonthlyFoodGroups.call({
      countryOrGroupId,
      micronutrients,
      mndsDataId,
    });
  }
  public getProjectedAvailabilities(
    countryOrGroupId: string,
    micronutrients: Array<MicronutrientDictionaryItem>,
    mndsDataId: string,
  ): Promise<Array<ProjectedAvailability>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.apiService.endpoints.currentData.getProjectedAvailabilities.call({
      countryOrGroupId,
      micronutrients,
      mndsDataId,
    });
  }
}
