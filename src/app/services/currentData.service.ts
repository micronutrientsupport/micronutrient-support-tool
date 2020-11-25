import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { MicronutrientDataOption } from '../apiAndObjects/objects/micronutrientDataOption';
import { PopulationGroup } from '../apiAndObjects/objects/populationGroup';
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
    micronutrients: Array<DictionaryItem>,
    populationGroup: PopulationGroup,
    singleOptionOnly: boolean,
  ): Promise<Array<MicronutrientDataOption>> {
    return this.apiService.currentData.getMicronutrientDataOptions.call({
      countryOrGroupId: countryOrgroup.id,
      micronutrientIds: micronutrients.map(item => item.id),
      populationGroupId: populationGroup.id,
      singleOptionOnly: singleOptionOnly,
    });
  }
}
