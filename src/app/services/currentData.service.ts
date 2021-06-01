import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { CountryDictionaryItem } from '../apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from '../apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { DietarySource } from '../apiAndObjects/objects/dietarySource';
import { DataLevel } from '../apiAndObjects/objects/enums/dataLevel.enum';
import { MicronutrientMeasureType } from '../apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { HouseholdHistogramData } from '../apiAndObjects/objects/householdHistogramData';
import { DataSource } from '../apiAndObjects/objects/dataSource';
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

  public getDataSources(
    countryOrGroup: CountryDictionaryItem,
    measureType: MicronutrientMeasureType,
    ageGenderGroup?: AgeGenderGroup,
    singleOptionOnly = false,
  ): Promise<Array<DataSource>> {
    return new Promise((resolve) => {
      // no point in calling API if parameters selections aren't valid
      if (
        null == countryOrGroup ||
        null == measureType ||
        (measureType === MicronutrientMeasureType.BIOMARKER && null == ageGenderGroup)
      ) {
        resolve([]); // no data sources
      } else {
        resolve(
          this.apiService.endpoints.currentData.getDataSources.call({
            countryOrGroup,
            measureType,
            ageGenderGroup,
            singleOptionOnly,
          }),
        );
      }
    });
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

  public getTopFood(
    countryOrGroup: CountryDictionaryItem,
    micronutrient: MicronutrientDictionaryItem,
    micronutrientDataOption: DataSource,
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
    dataSource: DataSource,
  ): Promise<HouseholdHistogramData> {
    return this.apiService.endpoints.currentData.getHouseholdHistogramData.call({
      countryOrGroup,
      micronutrients,
      dataSource,
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
    dataSource: DataSource,
  ): Promise<MonthlyFoodGroups> {
    return this.apiService.endpoints.currentData.getMonthlyFoodGroups.call({
      countryOrGroup,
      micronutrients,
      dataSource,
    });
  }
  public getProjectedAvailabilities(
    countryOrGroup: CountryDictionaryItem,
    micronutrients: Array<MicronutrientDictionaryItem>,
    dataSource: DataSource,
  ): Promise<Array<ProjectedAvailability>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.apiService.endpoints.currentData.getProjectedAvailabilities.call({
      countryOrGroup,
      micronutrients,
      dataSource,
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
