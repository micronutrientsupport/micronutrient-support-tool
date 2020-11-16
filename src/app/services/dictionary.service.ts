import { Injectable } from '@angular/core';
import { DictionaryType } from '../apiAndObjects/api/dictionaryType.enum';
import { Dictionary } from '../apiAndObjects/_lib_code/objects/dictionary';
import { ApiService } from '../apiAndObjects/api/api.service';

@Injectable()
export class DictionaryService {

  constructor(
    private apiService: ApiService,
  ) {
    // test
    // this.getDictionary(DictionaryType.COUNTRIES).then((dict) => {
    //   console.debug('countries', dict.getItems());
    // });
  }

  public getDictionary(type: DictionaryType): Promise<Dictionary> {
    return this.apiService.getDictionary(type);
  }
  public getDictionaries(types: Array<DictionaryType>): Promise<Array<Dictionary>> {
    return this.apiService.getDictionaries(types);
  }

}
