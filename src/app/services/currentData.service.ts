import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { CountryDictionaryItem } from '../apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from '../apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { DietarySource } from '../apiAndObjects/objects/dietarySource';
import { DataLevel } from '../apiAndObjects/objects/enums/dataLevel.enum';
import { HouseholdHistogramData } from '../apiAndObjects/objects/householdHistogramData';
import { DataSource } from '../apiAndObjects/objects/dataSource';
import { MonthlyFoodGroups } from '../apiAndObjects/objects/monthlyFoodGroups';
import { SubRegionDataItem } from '../apiAndObjects/objects/subRegionDataItem';
import { AgeGenderGroup } from '../apiAndObjects/objects/ageGenderGroup';
import { MicronutrientMeasureType } from '../apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { TopFoodSource } from '../apiAndObjects/objects/topFoodSource';

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

  public getAgeGenderGroups(micronutrients: Array<MicronutrientDictionaryItem>): Promise<Array<AgeGenderGroup>> {
    return this.apiService.endpoints.currentData.getAgeGenderGroups.call({
      micronutrients,
    });
  }

  public getTopFoods(
    micronutrient: MicronutrientDictionaryItem,
    micronutrientDataOption: DataSource,
    dataLevel: DataLevel,
  ): Promise<Array<TopFoodSource>> {
    return this.apiService.endpoints.currentData.getTopFoods.call({
      micronutrient,
      micronutrientDataOption,
      dataLevel,
    });
  }

  public getDataSources(
    country: CountryDictionaryItem,
    measureType: MicronutrientMeasureType,
    micronutrient: MicronutrientDictionaryItem,
    ageGenderGroup?: AgeGenderGroup,
    singleOptionOnly = false,
  ): Promise<Array<DataSource>> {
    return new Promise((resolve) => {
      // no point in calling API if required parameters aren't set
      if (
        null == country ||
        null == micronutrient ||
        null == measureType ||
        (measureType === MicronutrientMeasureType.BIOMARKER && null == ageGenderGroup)
      ) {
        resolve([]); // no data sources
      } else {
        resolve(
          this.apiService.endpoints.currentData.getDataSources.call({
            country,
            measureType,
            micronutrient,
            ageGenderGroup,
            singleOptionOnly,
          }),
        );
      }
    });
  }
}
