import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { CountryDictionaryItem } from '../apiAndObjects/objects/dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from '../apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { DataSource } from '../apiAndObjects/objects/dataSource';
import { AgeGenderGroup } from '../apiAndObjects/objects/ageGenderGroup';
import { MicronutrientMeasureType } from '../apiAndObjects/objects/enums/micronutrientMeasureType.enum';

@Injectable()
export class BiomarkerDataService {
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
