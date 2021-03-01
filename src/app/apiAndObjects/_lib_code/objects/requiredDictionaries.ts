import { Dictionary } from './dictionary';
import { DictionaryItem } from './dictionaryItem.interface';

export class RequiredDictionaries {
  protected readonly dictionaries = new Map<unknown, Dictionary>();

  public static validateDictionaries(
    dictionariesTypes: Array<unknown>,
    dictionaries: Array<Dictionary>,
  ): boolean {
    // console.debug('validateDictionaries', dictionariesTypes, dictionaries);
    return (
      (null != dictionariesTypes) && (Array.isArray(dictionariesTypes))
      && (null != dictionaries) && (Array.isArray(dictionaries))
      && (dictionariesTypes.every(expectedType => {
        const dict = dictionaries.find(thisDict => thisDict.type === expectedType);
        if (null == dict) {
          console.warn('Unable to create object as dictionary not available:', expectedType, dictionaries);
        }
        return (null != dict);
      }))
    );
  }

  /**
   * Add dictionaries.
   */
  public addDictionaries(dictionaries: Array<Dictionary>): void {
    dictionaries = (null == dictionaries) ? [] : dictionaries;
    dictionaries = Array.isArray(dictionaries) ? dictionaries : [dictionaries];
    this.concatDictionaries(dictionaries);
  }

  /**
   * Get a dictionary.
   * (Generics for convenience.)
   */
  public getDictionary<DICTIONARY_TYPE = Dictionary>(
    dictionaryType: unknown,
  ): DICTIONARY_TYPE {
    const requiredDict = this.dictionaries.get(dictionaryType);
    if (null == requiredDict) {
      console.warn('Can\'t get dictionary', dictionaryType);
    }
    return requiredDict as unknown as DICTIONARY_TYPE;
  }

  /**
   * Get an item from a dictionary.
   * (Generics for convenience.)
   */
  public getDictionaryItem<ITEM_TYPE = DictionaryItem>(
    dictionaryType: unknown,
    dictionaryItemId: string,
  ): ITEM_TYPE {
    const dict = this.getDictionary(dictionaryType);
    const item = (null == dict) ? null : dict.getItem<ITEM_TYPE>(dictionaryItemId);
    // output a message if there was an item id passed in but it didn't match
    if ((null != dict)
      && (null != dictionaryItemId)
      && ('' !== dictionaryItemId)
      && (null == item)) {
      console.warn(`Can't get item from dict '${String(dictionaryType).toString()}' with id '${dictionaryItemId}'`);
    }
    return item;
  }

  private concatDictionaries(dictionaries: Array<Dictionary>): void {
    dictionaries
      .filter(dict => (null != dict)) // remove nulls
      .forEach(dict => this.dictionaries.set(dict.type, dict)); // add in new ones
  }
}
