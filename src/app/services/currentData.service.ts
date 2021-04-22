import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { CountryDictionaryItem } from '../apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from '../apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { DietarySource } from '../apiAndObjects/objects/dietarySource';
import { DataLevel } from '../apiAndObjects/objects/enums/dataLevel.enum';
import { MicronutrientMeasureType } from '../apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { HouseholdHistogramData } from '../apiAndObjects/objects/householdHistogramData';
import { MicronutrientDataOption } from '../apiAndObjects/objects/micronutrientDataOption';
import { MonthlyFoodGroups } from '../apiAndObjects/objects/monthlyFoodGroups';
import { ProjectedAvailability } from '../apiAndObjects/objects/projectedAvailability';
import { ProjectedFoodSourcesData } from '../apiAndObjects/objects/projectedFoodSources';
import { SubRegionDataItem } from '../apiAndObjects/objects/subRegionDataItem';
import { ProjectionsSummaryCard } from '../apiAndObjects/objects/projectionsSummaryCard';
import { TopFoodSource } from '../apiAndObjects/objects/topFoodSource';
import { AgeGenderGroup } from '../apiAndObjects/objects/ageGenderGroup';

@Injectable()
export class CurrentDataService {
  constructor(private apiService: ApiService) {
    // TEST
    // void MicronutrientDictionaryItem.constructObject({ id: 'A' })
    //   .then((item: MicronutrientDictionaryItem) => {
    //     void this.apiService.endpoints.currentData.getAgeGenderGroups.call({
    //       micronutrients: [item],
    //     }).then(data => console.debug(data));
    //   });
  }

  public getMicronutrientDataOptions(
    countryOrGroup: CountryDictionaryItem,
    measureType: MicronutrientMeasureType,
    singleOptionOnly: boolean,
  ): Promise<Array<MicronutrientDataOption>> {
    return this.apiService.endpoints.currentData.getMicronutrientDataOptions.call({
      countryOrGroup,
      measureType,
      singleOptionOnly,
    });
  }

  public getSubRegionData(
    countryOrGroup: CountryDictionaryItem,
    micronutrient: MicronutrientDictionaryItem,
    mndsDataOption: MicronutrientDataOption,
    dataLevel: DataLevel,
  ): Promise<SubRegionDataItem> {
    return this.apiService.endpoints.currentData.getSubRegionData.call({
      countryOrGroup,
      micronutrient,
      mndsDataOption,
      dataLevel,
    });
  }

  public getDietarySources(
    countryOrGroup: CountryDictionaryItem,
    micronutrients: Array<MicronutrientDictionaryItem>,
    mndsDataOption: MicronutrientDataOption,
  ): Promise<Array<DietarySource>> {
    return this.apiService.endpoints.currentData.getDietarySources.call({
      countryOrGroup,
      micronutrients,
      mndsDataOption,
    });
  }

  public getTopFood(
    countryOrGroup: CountryDictionaryItem,
    micronutrient: MicronutrientDictionaryItem,
    micronutrientDataOption: MicronutrientDataOption,
    dataLevel: DataLevel,
  ): Promise<Array<TopFoodSource>> {
    return this.apiService.endpoints.currentData.getTopFood.call({
      countryOrGroup,
      micronutrient,
      micronutrientDataOption,
      dataLevel,
    });
  }

  public getHouseholdHistogramData(
    countryOrGroup: CountryDictionaryItem,
    micronutrients: Array<MicronutrientDictionaryItem>,
    mndsDataOption: MicronutrientDataOption,
  ): Promise<HouseholdHistogramData> {
    return this.apiService.endpoints.currentData.getHouseholdHistogramData.call({
      countryOrGroup,
      micronutrients,
      mndsDataOption,
    });
  }

  public getProjectedFoodSourceData(
    commodityOrFoodGroup: string,
    countryOrGroup: CountryDictionaryItem,
    micronutrients: Array<MicronutrientDictionaryItem>,
    scenarioId: string,
  ): Promise<Array<ProjectedFoodSourcesData>> {
    return this.apiService.endpoints.currentData.getProjectedFoodSourcesData.call({
      commodityOrFoodGroup,
      countryOrGroup,
      micronutrients,
      scenarioId,
    });
  }

  public getMonthlyFoodGroups(
    countryOrGroup: CountryDictionaryItem,
    micronutrients: Array<MicronutrientDictionaryItem>,
    mndsDataOption: MicronutrientDataOption,
  ): Promise<MonthlyFoodGroups> {
    return this.apiService.endpoints.currentData.getMonthlyFoodGroups.call({
      countryOrGroup,
      micronutrients,
      mndsDataOption,
    });
  }
  public getProjectedAvailabilities(
    countryOrGroup: CountryDictionaryItem,
    micronutrients: Array<MicronutrientDictionaryItem>,
    mndsDataOption: MicronutrientDataOption,
  ): Promise<Array<ProjectedAvailability>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.apiService.endpoints.currentData.getProjectedAvailabilities.call({
      countryOrGroup,
      micronutrients,
      mndsDataOption,
    });
  }

  public getProjectionsSummaryCardData(
    countryOrGroupId: string,
    micronutrient: MicronutrientDictionaryItem,
    scenarioId: string,
  ): Promise<Array<ProjectionsSummaryCard>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.apiService.endpoints.currentData.getProjectionsSummaryCardData.call({
      countryOrGroupId,
      micronutrientId: micronutrient.id,
      scenarioId,
    });
  }

  public getAgeGenderGroups(micronutrients: Array<MicronutrientDictionaryItem>): Promise<Array<AgeGenderGroup>> {
    return this.apiService.endpoints.currentData.getAgeGenderGroups.call({
      micronutrients,
    });
  }
}
