import { BaseDictionaryItem } from './baseDictionaryItem';
import { Dictionary } from './dictionary';
import { RequiresDictionaries } from './requiresDictionaries.interface';
import { DictionaryType } from '../../api/dictionaryType.enum';
import { DictionaryItem } from './dictionaryItem.interface';

export class BaseDictionaryItemRequiresDictionaries extends BaseDictionaryItem implements RequiresDictionaries {
  public readonly requiredDictionaryList: Array<DictionaryType> = [];
  protected _dictionaries = new Array<Dictionary>();

  public setDictionaries(dictionaries: Dictionary | Array<Dictionary>): this {
    dictionaries = Array.isArray(dictionaries) ? dictionaries : [dictionaries];
    this._dictionaries = this._dictionaries.concat(dictionaries);
    return this;
  }

  protected _getDictionary(dictionaryType: DictionaryType): Dictionary {
    // console.debug('testy', this.dictionaries);
    return this._dictionaries.find((dictionary: Dictionary) => dictionary.type === dictionaryType);
  }

  protected _getDictionaryItem(dictionaryType: DictionaryType, attributeId: string): DictionaryItem {
    const id = this._getString(attributeId);
    return null == id ? null : this._getDictionary(dictionaryType).getItem(id);
  }
}
