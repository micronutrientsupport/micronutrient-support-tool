import { DictionaryType } from '../../api/dictionaryType.enum';
import { BaseDictionaryItem } from '../../_lib_code/objects/baseDictionaryItem';

export class CountryDictionaryItem extends BaseDictionaryItem {
  public static readonly DESC_ATTRIBUTE = 'name';
  // public static readonly OUTLINE_ATTRIBUTE = 'outline';
  protected _sourceAttributeDesc = CountryDictionaryItem.DESC_ATTRIBUTE;

  // public outline: any;

  // protected populateValues(): void {
  //   super.populateValues();
  //   this.outline = this._getArray<number>(CountryDictionaryItem.OUTLINE_ATTRIBUTE);
  // }

  public static createMockItems(count: number, type: DictionaryType): Array<Record<string, unknown>> {
    return super.createMockItems(count, type).map(
      (item: Record<string, unknown>) =>
        // returnObj[this.OUTLINE_ATTRIBUTE] = [0, 10, 20, 0];
        item,
    );
  }
}
