import { DictionaryType } from '../../api/dictionaryType.enum';
import { BaseDictionaryItem } from '../../_lib_code/objects/baseDictionaryItem';
import { MicronutrientType } from '../enums/micronutrientType.enum';

export class MicronutrientDictionaryItem extends BaseDictionaryItem {
  public static readonly DESC_ATTRIBUTE = 'name';
  public static readonly TYPE_ATTRIBUTE = 'type';

  public type: MicronutrientType;

  protected _sourceAttributeDesc = MicronutrientDictionaryItem.DESC_ATTRIBUTE;

  public static createMockItems(count: number, type: DictionaryType): Array<Record<string, unknown>> {
    const types = [MicronutrientType.VITAMIN, MicronutrientType.MINERAL, MicronutrientType.OTHER];
    return super.createMockItems(count, type).map((item: Record<string, unknown>, index: number) => {
      item[this.TYPE_ATTRIBUTE] = types[index % types.length];
      return item;
    });
  }

  protected populateValues(): void {
    super.populateValues();
    this.type = this._getEnum(MicronutrientDictionaryItem.TYPE_ATTRIBUTE, MicronutrientType);
  }
}
