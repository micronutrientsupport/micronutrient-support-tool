import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { CountryDictionaryItem } from '../apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from '../apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { DietDataSource } from '../apiAndObjects/objects/dietDataSource';
import { MnAvailibiltyCountryItem } from '../apiAndObjects/objects/mnAvailibilityCountryItem';
import { MnAvailibiltyHouseholdItem } from '../apiAndObjects/objects/mnAvailibilityHouseholdItem';
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

  public getMicronutrientAvailability(
    country: CountryDictionaryItem,
    micronutrient: MicronutrientDictionaryItem,
    dataSource: DietDataSource,
  ): Promise<Array<MnAvailibiltyCountryItem> | Array<MnAvailibiltyHouseholdItem>> {
    return this.apiService.endpoints.diet.getMicronutrientAvailability.call({
      country,
      micronutrient,
      dataSource,
      asGeoJson: false,
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
