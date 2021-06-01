import { DictionaryType } from '../api/dictionaryType.enum';
import { BaseObjectRequiresDictionaries } from '../_lib_code/objects/baseObjectRequiresDictionaries';
import { CountryDictionaryItem } from './dictionaries/countryRegionDictionaryItem';
import { MicronutrientDictionaryItem } from './dictionaries/micronutrientDictionaryItem';

export class ProjectionsSummaryCard extends BaseObjectRequiresDictionaries {
  public static readonly KEYS = {
    COUNTRY: 'country',
    MICRONUTRIENT: 'micronutrient',
    SCENARIO: 'scenario',
    TARGET: 'target',
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
  public readonly target: number;
  public readonly referenceVal: number;
  public readonly referenceYear: number;
  public readonly intersectYear: string;
  public readonly difference: number;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.country = this._getDictionaryItem<CountryDictionaryItem>(
      DictionaryType.COUNTRIES,
      ProjectionsSummaryCard.KEYS.COUNTRY,
    );
    this.micronutrient = this._getDictionaryItem<MicronutrientDictionaryItem>(
      DictionaryType.MICRONUTRIENTS,
      ProjectionsSummaryCard.KEYS.MICRONUTRIENT,
    );
    this.scenario = this._getString(ProjectionsSummaryCard.KEYS.SCENARIO);
    this.target = this._getNumber(ProjectionsSummaryCard.KEYS.TARGET);
    this.referenceVal = this._getNumber(ProjectionsSummaryCard.KEYS.REFERENCE_VAL);
    this.referenceYear = this._getNumber(ProjectionsSummaryCard.KEYS.REFERENCE_YEAR);
    this.intersectYear = this._getString(ProjectionsSummaryCard.KEYS.INTERSECT_YEAR);
    this.difference = this._getNumber(ProjectionsSummaryCard.KEYS.DIFFERENCE);
  }
}
