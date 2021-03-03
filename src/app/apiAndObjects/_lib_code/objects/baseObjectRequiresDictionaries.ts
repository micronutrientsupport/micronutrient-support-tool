import { BaseObject } from './baseObject';
import { Dictionary } from './dictionary';
import { DictionaryItem } from './dictionaryItem.interface';
import { RequiredDictionaries } from './requiredDictionaries';

export class BaseObjectRequiresDictionaries extends BaseObject {
  public static readonly requiredDictionaryTypes: Array<unknown> = [];
  protected readonly _requiredDictionaries = new RequiredDictionaries();

  protected constructor(
    sourceObject?: Record<string, unknown>,
    dictionaries?: Array<Dictionary>,
  ) {
    super(sourceObject);
    this._requiredDictionaries.addDictionaries(dictionaries);
  }

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

  /**
   * Get a dictionary.
   * (Generics for convenience.)
   */
  protected _getDictionary<DICTIONARY_TYPE = Dictionary>(dictionaryType: unknown): DICTIONARY_TYPE {
    return this._requiredDictionaries.getDictionary<DICTIONARY_TYPE>(dictionaryType);
  }

  /**
   * Get an item from a dictionary.
   * (Generics for convenience.)
   */
  protected _getDictionaryItem<ITEM_TYPE = DictionaryItem>(
    dictionaryType: unknown,
    sourceKey: string,
  ): ITEM_TYPE {
    const dictionaryItemId = this._getString(sourceKey);
    return this._requiredDictionaries.getDictionaryItem<ITEM_TYPE>(dictionaryType, dictionaryItemId);
  }
}
