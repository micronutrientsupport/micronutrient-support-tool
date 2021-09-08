import { MapsDictionaryItem } from './mapsBaseDictionaryItem';

export class AgeGenderDictionaryItem extends MapsDictionaryItem {
  public static readonly ID_ATTRIBUTE: string = 'groupId';
  public static readonly NAME_ATTRIBUTE: string = 'groupName';
  public static readonly DESC_ATTRIBUTE: string = 'groupName';
  public static readonly KEYS = {
    GROUP: 'supraGroup',
  };

  public readonly group: string;

  protected constructor(sourceObject: Record<string, unknown>, id: string, name: string, description: string) {
    super(sourceObject, id, name, description);

    this.group = this._getString(AgeGenderDictionaryItem.KEYS.GROUP);
  }
}
