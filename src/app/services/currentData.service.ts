import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { CountryDictionaryItem } from '../apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from '../apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { DietarySource } from '../apiAndObjects/objects/dietarySource';
import { HouseholdHistogramData } from '../apiAndObjects/objects/householdHistogramData';
import { DataSource } from '../apiAndObjects/objects/dataSource';
import { MonthlyFoodGroups } from '../apiAndObjects/objects/monthlyFoodGroups';
import { MicronutrientMeasureType } from '../apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { AgeGenderDictionaryItem } from '../apiAndObjects/objects/dictionaries/ageGenderDictionaryItem';

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

  // MOVE TO new section service when made live
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

  // MOVE TO new section service when made live
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

  // MOVE TO new section service when made live
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

  public getDataSources(
    country: CountryDictionaryItem,
    measureType: MicronutrientMeasureType,
    micronutrient: MicronutrientDictionaryItem,
    ageGenderGroup?: AgeGenderDictionaryItem,
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
