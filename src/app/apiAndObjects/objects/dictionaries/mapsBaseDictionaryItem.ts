/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BaseDictionaryItem } from '../../_lib_code/objects/baseDictionaryItem';

export class MapsDictionaryItem extends BaseDictionaryItem {
  public static readonly ID_ATTRIBUTE = 'id';
  public static readonly NAME_ATTRIBUTE = 'name';
  public static readonly DESC_ATTRIBUTE = 'name';

  protected _sourceAttributeId = MapsDictionaryItem.ID_ATTRIBUTE;
  protected _sourceAttributeName = MapsDictionaryItem.NAME_ATTRIBUTE;
  protected _sourceAttributeDesc = MapsDictionaryItem.DESC_ATTRIBUTE;

}
