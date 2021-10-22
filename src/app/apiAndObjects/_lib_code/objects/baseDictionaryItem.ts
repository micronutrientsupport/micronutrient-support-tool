import { BaseObject } from './baseObject';
import { DictionaryItem } from './dictionaryItem.interface';
import { ObjectAccessor } from './objectAccessor';

/**
 * Boilerplate code for a dictionary item, which may need to be extended from
 * if your dictionary item is a little more than "simple", or your standard dictionary
 * attribute names differ from these default ones.
 */
export class BaseDictionaryItem extends BaseObject implements DictionaryItem {
  /** name of attribute containing the item's id */
  public static readonly ID_ATTRIBUTE: string = 'code';
  /** name of attribute containing the item's short name */
  public static readonly NAME_ATTRIBUTE: string = 'translation';
  /** name of attribute containing the item's longer name/desription */
  public static readonly DESC_ATTRIBUTE: string = 'description';

  /**
   * @param sourceObject raw data object
   */
  protected constructor(
    sourceObject: Record<string, unknown>,
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
  ) {
    super(sourceObject);
  }

  /**
   * Factory method for calling the constructor and validating the raw data object.
   *
   * @param source raw data object
   * @returns A Promise for the object that will be resolved when it has been fully built
   */
  public static constructObject(source: Record<string, unknown>): Promise<BaseDictionaryItem> {
    return Promise.resolve(
      !this.validateObject(source)
        ? null
        : new this(
            source,
            ObjectAccessor.getString(this.ID_ATTRIBUTE, source),
            ObjectAccessor.getString(this.NAME_ATTRIBUTE, source),
            ObjectAccessor.getString(this.DESC_ATTRIBUTE, source),
          ),
    );
  }
}
