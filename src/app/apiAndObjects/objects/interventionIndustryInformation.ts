import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { Named } from './named.interface';

export class InterventionIndustryInformation extends BaseObject implements Named {
  public static readonly KEYS = {
    INTERVENTION_ID: 'interventionId',
    INDUSTRY_INFO: 'industryInformation',
  };

  public readonly name: string;
  public readonly dataLevel: DataLevel;

  public readonly interventionId: number;
  public readonly industryInformation: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    // this.name = this._getString(InterventionIndustryInformation.KEYS.NAME);

    // this.dataLevel = this._getEnum(DietDataSource.KEYS.CONSUMPTION_DATA_TYPE, DataLevel);

    this.interventionId = this._getNumber(InterventionIndustryInformation.KEYS.INTERVENTION_ID);
    this.industryInformation = this._getString(InterventionIndustryInformation.KEYS.INDUSTRY_INFO);
  }
}
