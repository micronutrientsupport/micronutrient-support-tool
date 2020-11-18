import { DictionaryType } from '../../api/dictionaryType.enum';
import { BaseDictionaryItem } from '../../_lib_code/objects/baseDictionaryItem';
import { MicronutrientType } from '../enums/micronutrientDataOption';

export class MicronutrientDictionaryItem extends BaseDictionaryItem {
  public static readonly DESC_ATTRIBUTE = 'name';
  public static readonly TYPE_ATTRIBUTE = 'type';

  protected _sourceAttributeDesc = MicronutrientDictionaryItem.DESC_ATTRIBUTE;

  public type: MicronutrientType;

  protected populateValues(): void {
    super.populateValues();
    this.type = this._getEnum(MicronutrientDictionaryItem.TYPE_ATTRIBUTE, MicronutrientType);
  }

  public static createMockItems(count: number, type: DictionaryType): Array<object> {
    const names = ['Vitamin', 'Mineral', 'Other'];
    const types = [MicronutrientType.VITAMIN, MicronutrientType.MINERAL, MicronutrientType.OTHER];
    return super.createMockItems(count, type).map((item: object, index: number) => {
      item[this.TYPE_ATTRIBUTE] = types[index % types.length];
      return item;
    });
  }
}
