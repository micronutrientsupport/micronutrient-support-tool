import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { CountryDictionaryItem } from '../apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from '../apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { DataLevel } from '../apiAndObjects/objects/enums/dataLevel.enum';
import { DataSource } from '../apiAndObjects/objects/dataSource';
import { TopFoodSource } from '../apiAndObjects/objects/topFoodSource';
import { MicronutrientMeasureType } from '../apiAndObjects/objects/enums/micronutrientMeasureType.enum';
import { AgeGenderGroup } from '../apiAndObjects/objects/ageGenderGroup';

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
    countryOrGroup: CountryDictionaryItem,
    micronutrient: MicronutrientDictionaryItem,
    micronutrientDataOption: DataSource,
    dataLevel: DataLevel,
  ): Promise<Array<TopFoodSource>> {
    return this.apiService.endpoints.diet.getTopFoods.call({
      country: countryOrGroup,
      micronutrient,
      micronutrientDataOption,
      dataLevel,
    });
  }

  public getDataSources(
    country: CountryDictionaryItem,
    micronutrient: MicronutrientDictionaryItem,
    ageGenderGroup?: AgeGenderGroup,
    singleOptionOnly = false,
  ): Promise<Array<DataSource>> {
    // return new Promise((resolve) => {
    //   // no point in calling API if parameters selections aren't valid
    //   if (
    //     null == country ||
    //     null == measureType ||
    //     (measureType === MicronutrientMeasureType.BIOMARKER && null == ageGenderGroup)
    //   ) {
    //     resolve([]); // no data sources
    //   } else {
    //     resolve(
    return this.apiService.endpoints.diet.getDataSources.call({
      country: country,
      micronutrient,
      ageGenderGroup,
      singleOptionOnly,
    });
    //     );
    //   }
    // });
  }
}
