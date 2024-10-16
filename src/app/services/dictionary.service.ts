import { Injectable } from '@angular/core';
import { DictionaryType } from '../apiAndObjects/api/dictionaryType.enum';
import { Dictionary } from '../apiAndObjects/_lib_code/objects/dictionary';
import { ApiService } from '../apiAndObjects/api/api.service';

@Injectable()
export class DictionaryService {
  constructor(private apiService: ApiService) {
    // test
    // this.getDictionary(DictionaryType.POPULATION_GROUPS).then((dict) => {
    //   console.debug('DICT', dict);
    // });
  }

  public getDictionary(type: DictionaryType): Promise<Dictionary> {
    return this.apiService.getDictionary(type);
  }
  public getDictionaries(types: Array<DictionaryType>, useCache?: boolean): Promise<Array<Dictionary>> {
    return this.apiService.getDictionaries(types, useCache);
  }
}
