import { BehaviorSubject } from 'rxjs';
import { DictionaryItem } from './dictionaryItem.interface';

export class Dictionary {
  protected readonly itemsMap = new Map<string, DictionaryItem>();
  protected readonly itemsSrc = new BehaviorSubject<Array<DictionaryItem>>([]);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly itemsObs = this.itemsSrc.asObservable();

  constructor(
    public readonly type: unknown,
    dictionaryItems: Array<DictionaryItem> = [],
  ) {
    this.setItems(dictionaryItems);
  }

  public setItems(dictionaryItems: Array<DictionaryItem>): this {
    dictionaryItems.forEach((item: DictionaryItem) => {
      this.itemsMap.set(item.id, item);
    });
    this.itemsSrc.next(Array.from(this.itemsMap.values()));
    return this;
  }

  public getItem<T = DictionaryItem>(key: string): T {
    // console.debug('getItem', key, this.itemsMap);
    return (this.itemsMap.get(key) as unknown) as T;
  }
  public getItems<T = DictionaryItem>(keys?: Array<string>): Array<T> {
    const values = Array.from(this.itemsMap.values());
    return null == keys
      ? ((values as Array<unknown>) as Array<T>)
      : keys.map((key) => this.getItem<T>(key)).filter((item: T) => null != item);
  }
}
