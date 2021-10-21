import { Dictionary } from './dictionary';
import { DictionaryItem } from './dictionaryItem.interface';

/**
 * Accessor object for accessing a set of Dictionaries
 */
export class RequiredDictionaries {
  protected readonly dictionaries = new Map<unknown, Dictionary>();

  /**
   * @param dictionariesTypes Array of dictionary identifiers
   * @param dictionaries Array of dictionaries
   * @returns whether all of the dictionariesTypes exist in dictionaries
   */
  public static validateDictionaries(dictionariesTypes: Array<unknown>, dictionaries: Array<Dictionary>): boolean {
    // console.debug('validateDictionaries', dictionariesTypes, dictionaries);
    return (
      null != dictionariesTypes &&
      Array.isArray(dictionariesTypes) &&
      null != dictionaries &&
      Array.isArray(dictionaries) &&
      dictionariesTypes.every((expectedType) => {
        const dict = dictionaries.find((thisDict) => thisDict.type === expectedType);
        if (null == dict) {
          console.warn('Unable to create object as dictionary not available:', expectedType, dictionaries);
        }
        return null != dict;
      })
    );
  }

  /**
   * Adds dictionaries.
   *
   * @param dictionaries Array of Dictionaries to add.
   */
  public addDictionaries(dictionaries: Array<Dictionary>): void {
    dictionaries = null == dictionaries ? [] : dictionaries;
    dictionaries = Array.isArray(dictionaries) ? dictionaries : [dictionaries];
    this.concatDictionaries(dictionaries);
  }

  /**
   * @param dictionaryType Identifier that references the required Dictionary
   * @returns The matching Dictionary, or null if not exists (Generics for convenience.)
   */
  public getDictionary<DICTIONARY_TYPE = Dictionary>(dictionaryType: unknown): DICTIONARY_TYPE {
    const requiredDict = this.dictionaries.get(dictionaryType);
    if (null == requiredDict) {
      console.warn('Can\'t get dictionary', dictionaryType);
    }
    return requiredDict as unknown as DICTIONARY_TYPE;
  }

  /**
   * @param dictionaryType Identifier that references the required Dictionary
   * @param dictionaryItemId Identifier that references the required DictionaryItem, on the referenced Dictionary
   * @returns The matching DictionaryItem, or null if Dictionary or item does not exists (Generics for convenience.)
   */
  public getDictionaryItem<ITEM_TYPE = DictionaryItem>(
    dictionaryType: unknown,
    dictionaryItemId: string,
  ): null | ITEM_TYPE {
    let item: null | ITEM_TYPE = null;
    // don't bother even looking for the dictionary if there is no item id
    if (null != dictionaryItemId && '' !== dictionaryItemId) {
      const dict = this.getDictionary(dictionaryType);
      if (null != dict) {
        item = dict.getItem<ITEM_TYPE>(dictionaryItemId);
        // output a message if an item id was passed in but it didn't match
        if (null == item) {
          console.warn(`Can't get item from dict '${String(dictionaryType)}' with id '${dictionaryItemId}'`);
        }
      }
    }
    return item;
  }

  private concatDictionaries(dictionaries: Array<Dictionary>): void {
    dictionaries
      .filter((dict) => null != dict) // remove nulls
      .forEach((dict) => this.dictionaries.set(dict.type, dict)); // add in new ones
  }
}
