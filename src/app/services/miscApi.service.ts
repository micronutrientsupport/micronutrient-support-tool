import { Injectable } from '@angular/core';
import { ApiService } from '../apiAndObjects/api/api.service';
import { PopulationGroup } from '../apiAndObjects/objects/populationGroup';
import { DictionaryItem } from '../apiAndObjects/_lib_code/objects/dictionaryItem.interface';

@Injectable()
export class MiscApiService {
  constructor(private apiService: ApiService) {
  }

  public getPopulationGroups(
    countryOrgroup: DictionaryItem | string,
    singleOptionOnly: boolean,
  ): Promise<Array<PopulationGroup>> {
    return this.apiService.misc.getPopulationGroups.call({
      countryOrGroupId: ('string' === typeof countryOrgroup) ? countryOrgroup : countryOrgroup.id,
      singleOptionOnly: singleOptionOnly,
    });
  }
}
