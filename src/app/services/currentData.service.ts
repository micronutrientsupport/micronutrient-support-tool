import { Injectable } from '@angular/core';
import { DictionaryType } from '../apiAndObjects/api/dictionaryType.enum';
import { Dictionary } from '../apiAndObjects/_lib_code/objects/dictionary';
import { ApiService } from '../apiAndObjects/api/api.service';
import { MicronutrientDataOption } from '../apiAndObjects/objects/micronutrientDataOption';
import { DictionaryItem } from '../apiAndObjects/_lib_code/objects/dictionaryItem.interface';
import { DictionaryService } from './dictionary.service';

@Injectable()
export class CurrentDataService {
  constructor(private apiService: ApiService, private dictService: DictionaryService) {
    // test
    // dictService
    //   .getDictionaries([DictionaryType.COUNTRIES, DictionaryType.MICRONUTRIENTS, DictionaryType.POPULATION_GROUPS])
    //   .then((dicts: Array<Dictionary>) => {
    //     this.getMicronutrientDataOptions(dicts[0].getItems()[0], dicts[1].getItems()[0], dicts[2].getItems()[0]).then(
    //       (data) => {
    //         console.debug('data', data);
    //       },
    //     );
    //   });
  }

  public getMicronutrientDataOptions(
    countryOrgroup: DictionaryItem,
    micronutrient: DictionaryItem,
    populationGroup: DictionaryItem,
  ): Promise<Array<MicronutrientDataOption>> {
    return this.apiService.currentData.getMicronutrientDataOptions.call({
      countryOrGroupId: countryOrgroup.id,
      micronutrientId: micronutrient.id,
      poulationGroupId: populationGroup.id,
    });
  }
}
