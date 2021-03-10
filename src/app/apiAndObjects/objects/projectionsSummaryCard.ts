import { BaseObject } from '../_lib_code/objects/baseObject';

export class ProjectionsSummaryCard extends BaseObject {
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

  public readonly country: string;
  public readonly micronutrient: string;
  public readonly scenario: string;
  public readonly target: number;
  public readonly referenceVal: number;
  public readonly referenceYear: number;
  public readonly intersectYear: string;
  public readonly difference: number;

  protected constructor(
    sourceObject?: Record<string, unknown>,
  ) {
    super(sourceObject);

    this.country = this._getString(ProjectionsSummaryCard.KEYS.COUNTRY);
    this.micronutrient = this._getString(ProjectionsSummaryCard.KEYS.MICRONUTRIENT);
    this.scenario = this._getString(ProjectionsSummaryCard.KEYS.SCENARIO);
    this.target = this._getNumber(ProjectionsSummaryCard.KEYS.TARGET);
    this.referenceVal = this._getNumber(ProjectionsSummaryCard.KEYS.REFERENCE_VAL);
    this.referenceYear = this._getNumber(ProjectionsSummaryCard.KEYS.REFERENCE_YEAR);
    this.intersectYear = this._getString(ProjectionsSummaryCard.KEYS.INTERSECT_YEAR);
    this.difference = this._getNumber(ProjectionsSummaryCard.KEYS.DIFFERENCE);
  }
}
