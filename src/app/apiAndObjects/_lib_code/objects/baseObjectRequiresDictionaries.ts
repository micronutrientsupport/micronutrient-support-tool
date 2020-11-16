import { BaseObject } from './baseObject';
import { RequiresDictionaries } from './requiresDictionaries.interface';
import { Dictionary } from './dictionary';
import { DictionaryType } from '../../api/dictionaryType.enum';
import { DictionaryItem } from './dictionaryItem.interface';

export class BaseObjectRequiresDictionaries extends BaseObject implements RequiresDictionaries {
  protected _dictionaries = new Array<Dictionary>();

  public readonly _requiredDictionaryList: Array<DictionaryType> = [];

  public setDictionaries(dictionaries: Dictionary | Array<Dictionary>): this {
    dictionaries = Array.isArray(dictionaries) ? dictionaries : [dictionaries];
    this._dictionaries = this._dictionaries.concat(dictionaries);
    return this;
  }

  protected _getDictionary(dictionaryType: DictionaryType): Dictionary {
    // console.debug('testy', this.dictionaries);
    return this._dictionaries.find((dictionary: Dictionary) => (dictionary.type === dictionaryType));
  }

  protected _getDictionaryItem<ITEM_TYPE = DictionaryItem>(dictionaryType: DictionaryType, attributeId: string): ITEM_TYPE {
    const id = this._getString(attributeId);
    return (null == id)
      ? null
      : this._getDictionary(dictionaryType).getItem(id) as unknown as ITEM_TYPE;
  }

}
