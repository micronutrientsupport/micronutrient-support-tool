import { BehaviorSubject } from 'rxjs';
import { DictionaryItem } from './dictionaryItem.interface';

/**
 * Accessor object for accessing a set of related DictionaryItems
 */
export class Dictionary {
  protected readonly itemsMap = new Map<string, DictionaryItem>();
  protected readonly itemsSrc = new BehaviorSubject<Array<DictionaryItem>>([]);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly itemsObs = this.itemsSrc.asObservable();

  /**
   * @param type identifier for the dictionary
   * @param dictionaryItems The DictionaryItems that will be accessed
   */
  constructor(public readonly type: unknown, dictionaryItems: Array<DictionaryItem> = []) {
    this.setItems(dictionaryItems);
  }

  /**
   * Sets the accessible DictionaryItems
   *
   * @param dictionaryItems DictionaryItems
   * @returns reference to this
   */
  public setItems(dictionaryItems: Array<DictionaryItem>): this {
    dictionaryItems.forEach((item: DictionaryItem) => {
      this.itemsMap.set(item.id, item);
    });
    this.itemsSrc.next(Array.from(this.itemsMap.values()));
    return this;
  }
  /**
   * @param key identifier of the item required
   * @returns The DictionaryItem with the matching identifier
   */
  public getItem<T = DictionaryItem>(key: string): T {
    // console.debug('getItem', key, this.itemsMap);
    return this.itemsMap.get(key) as unknown as T;
  }
  /**
   * Like getItem but for many items.
   */
  public getItems<T = DictionaryItem>(keys?: Array<string>): Array<T> {
    const values = Array.from(this.itemsMap.values());
    return null == keys
      ? (values as Array<unknown> as Array<T>)
      : keys.map((key) => this.getItem<T>(key)).filter((item: T) => null != item);
  }
}
