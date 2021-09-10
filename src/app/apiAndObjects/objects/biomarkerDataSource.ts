import { BaseObject } from '../_lib_code/objects/baseObject';
import { Named } from './named.interface';

export class BiomarkerDataSource extends BaseObject implements Named {
  public static readonly KEYS = {
    ID: 'surveyId',
    NAME: 'surveyName',
    BIOMARKER_NAME: 'surveyName',
    MN_ID: 'micronutrientId',
    // COUNTRY_ID: 'countryId', // needed? if so we might grab the dictionary item.
  };

  public readonly id: string;
  public readonly name: string;
  public readonly year: number;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.id = this._getString(BiomarkerDataSource.KEYS.ID);
    this.name = this._getString(BiomarkerDataSource.KEYS.NAME);

    // TODO: update to value from underlying object when api response includes a year attribute
    this.year = 2222;
  }
}
