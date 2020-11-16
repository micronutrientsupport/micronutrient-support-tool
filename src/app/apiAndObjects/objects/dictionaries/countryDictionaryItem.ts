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

  public static createMockItems(count = 20): Array<object> {
    return new Array(20).fill(null).map((val, index: number) => {
      const returnObj = {};
      returnObj[this.ID_ATTRIBUTE] = `${index}`;
      returnObj[this.NAME_ATTRIBUTE] = `Country ${index}`;
      returnObj[this.DESC_ATTRIBUTE] = `Country ${index} Description`;
      // returnObj[this.OUTLINE_ATTRIBUTE] = [0, 10, 20, 0];
      return returnObj;
    });
  }
}
