import { BaseObject } from './baseObject';
import { Dictionary } from './dictionary';
import { DictionaryItem } from './dictionaryItem.interface';
import { RequiredDictionaries } from './requiredDictionaries';

/**
 * Basic object that is used as a base for objects that are returned from implements Endpoints,
 * which depends on dictionaries.  You can extend this (rather than the BaseObject) if your
 * object depends on dictionaries.
 */
export class BaseObjectRequiresDictionaries extends BaseObject {
  /** Requires overriding.  Class variable referencing the identifiers of the dictionaries that are depended on. */
  public static readonly requiredDictionaryTypes: Array<unknown> = [];
  protected readonly _requiredDictionaries = new RequiredDictionaries();

  /**
   * @param sourceObject raw data object
   * @param dictionaries An Array of dictionaries that are required to build this object
   */
  protected constructor(sourceObject?: Record<string, unknown>, dictionaries?: Array<Dictionary>) {
    super(sourceObject);
    this._requiredDictionaries.addDictionaries(dictionaries);
  }

  /**
   * Factory method for calling the constructor and validating the raw data object.
   *
   * @param source raw data object
   * @param dictionaries An Array of dictionaries that are required to build this object
   * @returns A Promise for the object that will be resolved when it has been fully built
   */
  public static constructObject(
    source?: Record<string, unknown>,
    dictionaries?: Array<Dictionary>,
  ): Promise<BaseObjectRequiresDictionaries> {
    return Promise.resolve(
      RequiredDictionaries.validateDictionaries(this.requiredDictionaryTypes, dictionaries) &&
        this.validateObject(source)
        ? new this(source, dictionaries)
        : null,
    );
  }

  /**
   * @param dictionaryType Identifier that references the required Dictionary
   * @returns The matching Dictionary (Generics for convenience.)
   */
  protected _getDictionary<DICTIONARY_TYPE = Dictionary>(dictionaryType: unknown): DICTIONARY_TYPE {
    return this._requiredDictionaries.getDictionary<DICTIONARY_TYPE>(dictionaryType);
  }

  /**
   * @param dictionaryType Identifier that references the required Dictionary
   * @param sourceKeys  string or array of strings with the first being the prefered value to retrieve.
   * @param source raw data object that the key will be looked for on. Defaults to _sourceObject
   * if not provided.
   * @returns The sourceKeys identified DictionaryItem from the dictionaryType identified Dictionary
   */
  protected _getDictionaryItem<ITEM_TYPE = DictionaryItem>(
    dictionaryType: unknown,
    sourceKeys: string | Array<string>,
    source?: Record<string, unknown>,
  ): ITEM_TYPE {
    const dictionaryItemId = this._getString(sourceKeys, source);
    return this._requiredDictionaries.getDictionaryItem<ITEM_TYPE>(dictionaryType, dictionaryItemId);
  }
}
