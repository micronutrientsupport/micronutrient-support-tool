import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { DietarySource } from '../apiAndObjects/objects/dietarySource';
import { HouseholdHistogramData } from '../apiAndObjects/objects/householdHistogramData';
import { MicronutrientDataOption } from '../apiAndObjects/objects/micronutrientDataOption';
import { MonthlyFoodGroups } from '../apiAndObjects/objects/monthlyFoodGroups';
import { PopulationGroup } from '../apiAndObjects/objects/populationGroup';
import { SubRegionDataItem } from '../apiAndObjects/objects/subRegionDataItem';
import { TopFoodSource } from '../apiAndObjects/objects/topFoodSource';
import { DictionaryItem } from '../apiAndObjects/_lib_code/objects/dictionaryItem.interface';
import { DictionaryService } from './dictionary.service';

@Injectable()
export class CurrentDataService {
  constructor(private apiService: ApiService, private dictService: DictionaryService) {
    // TEST
    // void this.apiService.endpoints.currentData.getMonthlyFoodGroups.call({
    //   countryOrGroupId: '',
    //   micronutrientIds: [],
    //   populationGroupId: '',
    //   mndsDataId: '',
    // }).then(data => console.debug(data));
  }

  public getMicronutrientDataOptions(
    countryOrgroup: DictionaryItem | string,
    micronutrients: Array<DictionaryItem | string>,
    populationGroup: PopulationGroup | string,
    singleOptionOnly: boolean,
  ): Promise<Array<MicronutrientDataOption>> {
    return this.apiService.endpoints.currentData.getMicronutrientDataOptions.call({
      countryOrGroupId: 'string' === typeof countryOrgroup ? countryOrgroup : countryOrgroup.id,
      micronutrientIds: micronutrients.map((item) => ('string' === typeof item ? item : item.id)),
      populationGroupId: 'string' === typeof populationGroup ? populationGroup : populationGroup.id,
      singleOptionOnly,
    });
  }

  public getSubRegionData(
    countryOrgroup: DictionaryItem,
    micronutrients: Array<DictionaryItem>,
    populationGroup: PopulationGroup,
    mndsData: MicronutrientDataOption,
  ): Promise<Array<SubRegionDataItem>> {
    return this.apiService.endpoints.currentData.getSubRegionData.call({
      countryOrGroupId: countryOrgroup.id,
      micronutrientIds: micronutrients.map((item) => item.id),
      populationGroupId: populationGroup.id,
      mndsDataId: mndsData.id,
    });
  }

  public getDietarySources(
    countryOrgroup: DictionaryItem,
    micronutrients: Array<DictionaryItem>,
    populationGroup: PopulationGroup,
    mndsData: MicronutrientDataOption,
  ): Promise<Array<DietarySource>> {
    return this.apiService.endpoints.currentData.getDietarySources.call({
      countryOrGroupId: countryOrgroup.id,
      micronutrientIds: micronutrients.map((item) => item.id),
      populationGroupId: populationGroup.id,
      mndsDataId: mndsData.id,
    });
  }

  public getTopFood(
    countryOrGroupId: string,
    micronutrients: Array<string>,
    populationGroupId: string,
    // mndsData: MicronutrientDataOption,
  ): Promise<Array<TopFoodSource>> {
    return this.apiService.endpoints.currentData.getTopFood.call({
      countryOrGroupId: countryOrGroupId,
      micronutrientIds: micronutrients,
      populationGroupId: populationGroupId,
      // mndsDataId: mndsData.id,
    });
  }

  public getHouseholdHistogramData(
    countryOrGroupId: string,
    micronutrients: Array<string>,
    populationGroupId: string,
    mndsDataId: string,
  ): Promise<Array<HouseholdHistogramData>> {
    return this.apiService.endpoints.currentData.getHouseholdHistogramData.call({
      countryOrGroupId: countryOrGroupId,
      micronutrientIds: micronutrients,
      populationGroupId: populationGroupId,
      mndsDataId: mndsDataId,
    });
  }

  public getMonthlyFoodGroups(
    countryOrGroupId: string,
    micronutrients: Array<string>,
    populationGroupId: string,
    mndsDataId: string,
  ): Promise<MonthlyFoodGroups> {
    return this.apiService.endpoints.currentData.getMonthlyFoodGroups.call({
      countryOrGroupId: countryOrGroupId,
      micronutrientIds: micronutrients,
      populationGroupId: populationGroupId,
      mndsDataId: mndsDataId,
    });
  }
}
