import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { CountryDictionaryItem } from '../apiAndObjects/objects/dictionaries/countryDictionaryItem';
import { MicronutrientDictionaryItem } from '../apiAndObjects/objects/dictionaries/micronutrientDictionaryItem';
import { AgeGenderDictionaryItem } from '../apiAndObjects/objects/dictionaries/ageGenderDictionaryItem';
import { BiomarkerDataSource } from '../apiAndObjects/objects/biomarkerDataSource';

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
    micronutrient: MicronutrientDictionaryItem,
    ageGenderGroup: AgeGenderDictionaryItem,
    singleOptionOnly = false,
  ): Promise<Array<BiomarkerDataSource>> {
    return this.apiService.endpoints.biomarker.getDataSources.call({
      country,
      micronutrient,
      ageGenderGroup,
      singleOptionOnly,
    });
  }
}
