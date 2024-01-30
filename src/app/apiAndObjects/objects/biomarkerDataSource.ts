import { BaseObject } from '../_lib_code/objects/baseObject';
import { Named } from './named.interface';

export class BiomarkerDataSource extends BaseObject implements Named {
  public static readonly KEYS = {
    COUNTRY_ID: 'countryId',
    BIOMARKER_NAME: 'biomarkerName',
    MN_ID: 'micronutrientId',
    ID: 'surveyId',
    GROUP_ID: 'groupId',
    AGG_FIELDS: 'aggregationFields',
    NAME: 'surveyName',
    DESCRIPTION: 'surveyDescription',
    METADATA: 'surveyMetadata',
    YEAR: 'surveyYear',
  };

  public readonly countryId: string;
  public readonly biomarkerName: string;
  public readonly mnId: string;
  public readonly id: string;
  public readonly groupId: string;
  public readonly aggFields: Array<string>;
  public readonly name: string;
  public readonly description: string;
  public readonly metadata: string;
  public readonly year: number;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.countryId = this._getString(BiomarkerDataSource.KEYS.COUNTRY_ID);
    this.biomarkerName = this._getString(BiomarkerDataSource.KEYS.BIOMARKER_NAME);
    this.mnId = this._getString(BiomarkerDataSource.KEYS.MN_ID);
    this.id = this._getString(BiomarkerDataSource.KEYS.ID);
    this.groupId = this._getString(BiomarkerDataSource.KEYS.GROUP_ID);
    this.aggFields = this._getArray(BiomarkerDataSource.KEYS.AGG_FIELDS);
    this.name = this._getString(BiomarkerDataSource.KEYS.NAME);
    this.description = this._getString(BiomarkerDataSource.KEYS.DESCRIPTION);
    this.metadata = this._getString(BiomarkerDataSource.KEYS.METADATA);
    this.year = this._getNumber(BiomarkerDataSource.KEYS.YEAR);
  }
}
