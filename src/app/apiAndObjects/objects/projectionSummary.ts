import { DictionaryType } from '../api/dictionaryType.enum';
import { BaseObjectRequiresDictionaries } from '../_lib_code/objects/baseObjectRequiresDictionaries';
import { Dictionary } from '../_lib_code/objects/dictionary';
import { CountryDictionaryItem } from './dictionaries/countryDictionaryItem';
import { MicronutrientDictionaryItem } from './dictionaries/micronutrientDictionaryItem';

export class ProjectionsSummary extends BaseObjectRequiresDictionaries {
  public static readonly KEYS = {
    COUNTRY: 'country',
    MICRONUTRIENT: 'micronutrient',
    SCENARIO: 'scenario',
    RECOMMENDED: 'recommended',
    REFERENCE_VAL: 'referenceVal',
    REFERENCE_YEAR: 'referenceYear',
    INTERSECT_YEAR: 'intersectYear',
    DIFFERENCE: 'difference',
  };

  public static readonly requiredDictionaryTypes: Array<DictionaryType> = [
    DictionaryType.COUNTRIES,
    DictionaryType.MICRONUTRIENTS,
  ];

  public readonly country: CountryDictionaryItem;
  public readonly micronutrient: MicronutrientDictionaryItem;
  public readonly scenario: string;
  public readonly recommended: number;
  public readonly referenceVal: number;
  public readonly referenceYear: number;
  public readonly intersectYear: string;
  public readonly difference: number;

  protected constructor(sourceObject?: Record<string, unknown>, dictionaries?: Array<Dictionary>) {
    super(sourceObject, dictionaries);

    this.country = this._getDictionaryItem<CountryDictionaryItem>(
      DictionaryType.COUNTRIES,
      ProjectionsSummary.KEYS.COUNTRY,
    );
    this.micronutrient = this._getDictionaryItem<MicronutrientDictionaryItem>(
      DictionaryType.MICRONUTRIENTS,
      ProjectionsSummary.KEYS.MICRONUTRIENT,
    );
    this.scenario = this._getString(ProjectionsSummary.KEYS.SCENARIO);
    this.recommended = this._getNumber(ProjectionsSummary.KEYS.RECOMMENDED);
    this.referenceVal = this._getNumber(ProjectionsSummary.KEYS.REFERENCE_VAL);
    this.referenceYear = this._getNumber(ProjectionsSummary.KEYS.REFERENCE_YEAR);
    this.intersectYear = this._getString(ProjectionsSummary.KEYS.INTERSECT_YEAR);
    this.difference = this._getNumber(ProjectionsSummary.KEYS.DIFFERENCE);
  }
}
