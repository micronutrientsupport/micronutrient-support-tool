import { Injector } from '@angular/core';
import { DictionaryType } from 'src/app/apiAndObjects/api/dictionaryType.enum';
import { DictionaryItem } from 'src/app/apiAndObjects/_lib_code/objects/dictionaryItem.interface';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { QuickMapsQueryParamKey } from '../quickMapsQueryParamKey.enum';
import { Converter } from './converter.abstract';

export class DictItemConverter<DictItemType extends DictionaryItem> extends Converter<DictItemType> {
  constructor(queryStringkey: QuickMapsQueryParamKey, protected readonly dictType: DictionaryType) {
    super(queryStringkey);
  }

  public getString(): string {
    return null == this.item ? '' : this.item.id;
  }
  public getItem(injector: Injector): Promise<DictItemType> {
    const dictionariesService = injector.get<DictionaryService>(DictionaryService);
    return dictionariesService
      .getDictionary(this.dictType)
      .then((dict) => dict.getItem<DictItemType>(this.stringValue));
  }
}
