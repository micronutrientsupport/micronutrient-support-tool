import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { Named } from './named.interface';

export class InterventionMonitoringInformation extends BaseObject implements Named {
  public static readonly KEYS = {
    INTERVENTION_ID: 'interventionId',
    MONITORING_INFO: 'monitoringInformation',
  };

  public readonly name: string;
  public readonly dataLevel: DataLevel;

  public readonly interventionId: number;
  public readonly monitoringInformation: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    // this.name = this._getString(InterventionMonitoringInformation.KEYS.NAME);

    // this.dataLevel = this._getEnum(DietDataSource.KEYS.CONSUMPTION_DATA_TYPE, DataLevel);

    this.interventionId = this._getNumber(InterventionMonitoringInformation.KEYS.INTERVENTION_ID);
    this.monitoringInformation = this._getString(InterventionMonitoringInformation.KEYS.MONITORING_INFO);
  }
}
