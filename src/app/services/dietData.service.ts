import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { CountryDictionaryItem } from '../apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from '../apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { DietDataSource } from '../apiAndObjects/objects/dietDataSource';
import { SubRegionDataItem } from '../apiAndObjects/objects/subRegionDataItem';
import { TopFoodSource } from '../apiAndObjects/objects/topFoodSource';

@Injectable()
export class DietDataService {
  constructor(private apiService: ApiService) {
    // TEST
    // void MicronutrientDictionaryItem.constructObject({ id: 'A' })
    //   .then((item: MicronutrientDictionaryItem) => {
    //     void this.apiService.endpoints.currentData.getAgeGenderGroups.call({
    //       micronutrients: [item],
    //     }).then(data => console.debug(data));
    //   });
  }

  public getTopFoods(
    micronutrient: MicronutrientDictionaryItem,
    dataSource: DietDataSource,
  ): Promise<Array<TopFoodSource>> {
    return this.apiService.endpoints.diet.getTopFoods.call({
      micronutrient,
      dataSource,
    });
  }

  // TODO: needs separate endpoints for data levels
  public getDietaryAvailability(
    country: CountryDictionaryItem,
    micronutrient: MicronutrientDictionaryItem,
    dataSource: DietDataSource,
  ): Promise<SubRegionDataItem> {
    return this.apiService.endpoints.diet.getDietaryAvailability.call({
      country: country,
      micronutrient,
      dataSource,
    });
  }

  public getDataSources(
    country: CountryDictionaryItem,
    micronutrient: MicronutrientDictionaryItem,
    singleOptionOnly = false,
  ): Promise<Array<DietDataSource>> {
    return this.apiService.endpoints.diet.getDataSources.call({
      country,
      micronutrient,
      singleOptionOnly,
    });
  }
}
