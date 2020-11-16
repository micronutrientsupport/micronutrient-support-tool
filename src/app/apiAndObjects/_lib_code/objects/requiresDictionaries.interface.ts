import { DictionaryType } from '../../api/dictionaryType.enum';
import { Dictionary } from './dictionary';

export interface RequiresDictionaries {
  readonly _requiredDictionaryList: Array<DictionaryType>;
  setDictionaries(dictionaries: Dictionary | Array<Dictionary>): this;
}
