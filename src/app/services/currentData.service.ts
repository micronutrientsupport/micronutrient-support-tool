import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { CountryDictionaryItem } from '../apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from '../apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { DietarySource } from '../apiAndObjects/objects/dietarySource';
import { DataLevel } from '../apiAndObjects/objects/enums/dataLevel.enum';
import { HouseholdHistogramData } from '../apiAndObjects/objects/householdHistogramData';
import { DataSource } from '../apiAndObjects/objects/dataSource';
import { MonthlyFoodGroups } from '../apiAndObjects/objects/monthlyFoodGroups';
import { ProjectedAvailability } from '../apiAndObjects/objects/projectedAvailability';
import { SubRegionDataItem } from '../apiAndObjects/objects/subRegionDataItem';
import { ProjectionsSummary } from '../apiAndObjects/objects/projectionSummary';
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

  public getSubRegionData(
    countryOrGroup: CountryDictionaryItem,
    micronutrient: MicronutrientDictionaryItem,
    dataSource: DataSource,
    dataLevel: DataLevel,
  ): Promise<SubRegionDataItem> {
    return this.apiService.endpoints.currentData.getSubRegionData.call({
      countryOrGroup,
      micronutrient,
      dataSource,
      dataLevel,
    });
  }

  public getDietarySources(
    countryOrGroup: CountryDictionaryItem,
    micronutrients: Array<MicronutrientDictionaryItem>,
    dataSource: DataSource,
  ): Promise<Array<DietarySource>> {
    return this.apiService.endpoints.currentData.getDietarySources.call({
      countryOrGroup,
      micronutrients,
      dataSource,
    });
  }

  public getHouseholdHistogramData(
    countryOrGroup: CountryDictionaryItem,
    micronutrients: Array<MicronutrientDictionaryItem>,
    dataSource: DataSource,
  ): Promise<HouseholdHistogramData> {
    return this.apiService.endpoints.currentData.getHouseholdHistogramData.call({
      countryOrGroup,
      micronutrients,
      dataSource,
    });
  }

  public getMonthlyFoodGroups(
    countryOrGroup: CountryDictionaryItem,
    micronutrients: Array<MicronutrientDictionaryItem>,
    dataSource: DataSource,
  ): Promise<MonthlyFoodGroups> {
    return this.apiService.endpoints.currentData.getMonthlyFoodGroups.call({
      countryOrGroup,
      micronutrients,
      dataSource,
    });
  }
  public getProjectedAvailabilities(): Promise<Array<ProjectedAvailability>> {
    return this.apiService.endpoints.currentData.getProjectedAvailabilities.call();
  }

  public getProjectionSummary(
    countryOrGroupId: string,
    micronutrient: MicronutrientDictionaryItem,
    scenarioId: string,
  ): Promise<ProjectionsSummary> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.apiService.endpoints.currentData.getProjectionSummary.call({
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
