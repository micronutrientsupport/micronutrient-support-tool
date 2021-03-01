import { BaseObject } from './baseObject';
import { DictionaryItem } from './dictionaryItem.interface';
import { ObjectAccessor } from './objectAccessor';

export class BaseDictionaryItem extends BaseObject implements DictionaryItem {
  public static readonly ID_ATTRIBUTE: string = 'code';
  public static readonly NAME_ATTRIBUTE: string = 'translation';
  public static readonly DESC_ATTRIBUTE: string = 'description';

  protected constructor(
    sourceObject: Record<string, unknown>,
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
  ) {
    super(sourceObject);
  }

  public static constructObject(source: Record<string, unknown>): Promise<BaseDictionaryItem> {
    return Promise.resolve(
      (!this.validateObject(source))
        ? null
        : new this(
          source,
          ObjectAccessor.getString(this.ID_ATTRIBUTE, source),
          ObjectAccessor.getString(this.NAME_ATTRIBUTE, source),
          ObjectAccessor.getString(this.DESC_ATTRIBUTE, source),
        )
    );
  }
}
