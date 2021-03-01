import { BaseObject } from './baseObject';
import { Dictionary } from './dictionary';
import { DictionaryItem } from './dictionaryItem.interface';
import { RequiredDictionaries } from './requiredDictionaries';

export class BaseObjectRequiresDictionaries extends BaseObject {
  public static readonly requiredDictionaryTypes: Array<any> = [];
  protected readonly _requiredDictionaries = new RequiredDictionaries();

  /**
   * used by object builder.
   */
  public static constructObject(
    source?: Record<string, unknown>,
    dictionaries?: Array<Dictionary>,
  ): Promise<BaseObjectRequiresDictionaries> {
    return Promise.resolve((
      RequiredDictionaries.validateDictionaries(this.requiredDictionaryTypes, dictionaries)
      && this.validateObject(source)
    )
      ? new this(source, dictionaries)
      : null
    );
  }

  protected constructor(
    sourceObject?: Record<string, unknown>,
    dictionaries?: Array<Dictionary>,
  ) {
    super(sourceObject);
    this._requiredDictionaries.addDictionaries(dictionaries);
  }

  /**
   * Get a dictionary.
   * (Generics for convenience.)
   */
  protected _getDictionary<DICTIONARY_TYPE = Dictionary>(dictionaryType: any): DICTIONARY_TYPE {
    return this._requiredDictionaries.getDictionary<DICTIONARY_TYPE>(dictionaryType);
  }

  /**
   * Get an item from a dictionary.
   * (Generics for convenience.)
   */
  protected _getDictionaryItem<ITEM_TYPE = DictionaryItem>(
    dictionaryType: any,
    sourceKey: string,
  ): ITEM_TYPE {
    const dictionaryItemId = this._getString(sourceKey);
    return this._requiredDictionaries.getDictionaryItem<ITEM_TYPE>(dictionaryType, dictionaryItemId);
  }
}
