import { DictionaryItem } from './dictionaryItem.interface';
import { BaseObject } from './baseObject';
import { DictionaryType } from '../../api/dictionaryType.enum';

export class BaseDictionaryItem extends BaseObject {
  public static readonly ID_ATTRIBUTE: string = 'code';
  public static readonly NAME_ATTRIBUTE: string = 'translation';
  public static readonly DESC_ATTRIBUTE: string = 'description';

  protected _sourceAttributeId = BaseDictionaryItem.ID_ATTRIBUTE;
  protected _sourceAttributeName = BaseDictionaryItem.NAME_ATTRIBUTE;
  protected _sourceAttributeDesc = BaseDictionaryItem.DESC_ATTRIBUTE;

  public id: string;
  public name: string;
  public description: string;

  public static toString(source: DictionaryItem | Array<DictionaryItem>): string {
    return (Array.isArray(source) ? source : [source])
      .map((item: DictionaryItem) => item.name)
      .filter((name: string) => name !== '')
      .sort()
      .join(', ');
  }

  public static makeItemFromObject(source: object): BaseDictionaryItem {
    return super.makeItemFromObject(source) as BaseDictionaryItem;
  }

  // helper for making locally defined dictionary item
  public static make(id: string, name: string, description = name): BaseDictionaryItem {
    const source = {};
    source[this.ID_ATTRIBUTE] = id;
    source[this.NAME_ATTRIBUTE] = name;
    source[this.DESC_ATTRIBUTE] = description;
    return super.makeItemFromObject(source) as BaseDictionaryItem;
  }

  public static createMockItems(count: number, type: DictionaryType): Array<object> {
    return new Array(count).fill(null).map((val, index: number) => {
      const returnObj = {};
      returnObj[this.ID_ATTRIBUTE] = `${index}`;
      returnObj[this.NAME_ATTRIBUTE] = `${DictionaryType[type]} ${index}`;
      returnObj[this.DESC_ATTRIBUTE] = `${DictionaryType[type]} ${index} description`;
      return returnObj;
    });
  }

  protected constructor(protected _sourceObject: object) {
    super(_sourceObject);
  }

  protected populateValues(): void {
    super.populateValues();

    this.id = this._getString(this._sourceAttributeId);
    this.name = this._getString(this._sourceAttributeName);
    this.description = this._getString(this._sourceAttributeDesc);
  }
}
