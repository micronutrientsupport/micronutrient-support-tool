import { BaseDictionaryItem } from './baseDictionaryItem';
import { BaseObjectRequiresDictionaries } from './baseObjectRequiresDictionaries';
import { Dictionary } from './dictionary';
import { DictionaryItem } from './dictionaryItem.interface';
import { ObjectAccessor } from './objectAccessor';
import { RequiredDictionaries } from './requiredDictionaries';

export class BaseDictionaryItemRequiresDictionaries
  extends BaseObjectRequiresDictionaries
  implements DictionaryItem {

  public static readonly ID_ATTRIBUTE = BaseDictionaryItem.ID_ATTRIBUTE;
  public static readonly NAME_ATTRIBUTE = BaseDictionaryItem.NAME_ATTRIBUTE;
  public static readonly DESC_ATTRIBUTE = BaseDictionaryItem.DESC_ATTRIBUTE;

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
   * used by object builder.
   */
  public static constructObject(
    source?: Record<string, unknown>,
    dictionaries?: Array<Dictionary>,
  ): Promise<BaseDictionaryItemRequiresDictionaries> {
    return Promise.resolve((
      !RequiredDictionaries.validateDictionaries(this.requiredDictionaryTypes, dictionaries)
      || !this.validateObject(source)
    )
      ? null
      : new this(
        source,
        ObjectAccessor.getString(this.ID_ATTRIBUTE, source),
        ObjectAccessor.getString(this.NAME_ATTRIBUTE, source),
        ObjectAccessor.getString(this.DESC_ATTRIBUTE, source),
        dictionaries,
      )
    );
  }
}
