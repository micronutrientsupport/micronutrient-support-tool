import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { CountryDictionaryItem } from '../apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from '../apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { DataLevel } from '../apiAndObjects/objects/enums/dataLevel.enum';
import { DataSource } from '../apiAndObjects/objects/dataSource';
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
    micronutrientDataOption: DataSource,
    dataLevel: DataLevel,
  ): Promise<Array<TopFoodSource>> {
    return this.apiService.endpoints.currentData.getTopFoods.call({
      micronutrient,
      micronutrientDataOption,
      dataLevel,
    });
  }

  public getDietaryAvailability(
    countryOrGroup: CountryDictionaryItem,
    micronutrient: MicronutrientDictionaryItem,
    dataSource: DataSource,
    dataLevel: DataLevel,
  ): Promise<SubRegionDataItem> {
    return this.apiService.endpoints.diet.getDietaryAvailability.call({
      country: countryOrGroup,
      micronutrient,
      dataSource,
      dataLevel,
    });
  }
}
