import { BaseDictionaryItem } from './baseDictionaryItem';
import { BaseObjectRequiresDictionaries } from './baseObjectRequiresDictionaries';
import { Dictionary } from './dictionary';
import { DictionaryItem } from './dictionaryItem.interface';
import { ObjectAccessor } from './objectAccessor';
import { RequiredDictionaries } from './requiredDictionaries';

/**
 * Boilerplate code for a dictionary item which itself depends on other dictionaries,
 * which may need to be extended from if your dictionary item is a little more than "simple",
 * or your standard dictionary attribute names differ from these default ones.
 */
export class BaseDictionaryItemRequiresDictionaries extends BaseObjectRequiresDictionaries implements DictionaryItem {
  /** name of attribute containing the item's id */
  public static readonly ID_ATTRIBUTE = BaseDictionaryItem.ID_ATTRIBUTE;
  /** name of attribute containing the item's short name */
  public static readonly NAME_ATTRIBUTE = BaseDictionaryItem.NAME_ATTRIBUTE;
  /** name of attribute containing the item's longer name/desription */
  public static readonly DESC_ATTRIBUTE = BaseDictionaryItem.DESC_ATTRIBUTE;

  /**
   * @param sourceObject raw data object
   * @param dictionaries An Array of dictionaries that are required to build this object
   */
  protected constructor(
    sourceObject: Record<string, unknown>,
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    dictionaries?: Array<Dictionary>,
  ) {
    super(sourceObject, dictionaries);
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
  ): Promise<BaseDictionaryItemRequiresDictionaries> {
    return Promise.resolve(
      !RequiredDictionaries.validateDictionaries(this.requiredDictionaryTypes, dictionaries) ||
        !this.validateObject(source)
        ? null
        : new this(
            source,
            ObjectAccessor.getString(this.ID_ATTRIBUTE, source),
            ObjectAccessor.getString(this.NAME_ATTRIBUTE, source),
            ObjectAccessor.getString(this.DESC_ATTRIBUTE, source),
            dictionaries,
          ),
    );
  }
}
