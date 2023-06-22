import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { Named } from './named.interface';
import * as jsonLogic from 'json-logic-js';

export class InterventionMonitoringInformation extends BaseObject implements Named {
  public static readonly KEYS = {
    INTERVENTION_ID: 'interventionId',
    MONITORING_INFO: 'monitoringInformation',
  };

  public readonly name: string;
  public readonly dataLevel: DataLevel;

  public readonly interventionId: number;
  public readonly monitoringInformation: Array<MonitoringInformation>;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.interventionId = this._getNumber(InterventionMonitoringInformation.KEYS.INTERVENTION_ID);
    this.monitoringInformation = this._getArray(InterventionMonitoringInformation.KEYS.MONITORING_INFO);
  }
}

export interface MonitoringInformationMissingDataItem {
  year0: number;
  year1: number;
  year2: number;
  year3: number;
  year4: number;
  year5: number;
  year6: number;
  year7: number;
  year8: number;
  year9: number;
  rowIndex: number;
}
export interface MonitoringInformationMissingData {
  [number: string]: MonitoringInformationMissingDataItem;
}

export interface MonitoringInformation {
  year0: number;
  year1: number;
  year2: number;
  year3: number;
  year4: number;
  year5: number;
  year6: number;
  year7: number;
  year8: number;
  year9: number;
  rowName: string;
  rowIndex: number;
  rowUnits: string;
  labelText: string;
  dataSource: string;
  isEditable: boolean;
  missingData: MonitoringInformationMissingData;
  missingRows: Array<number>;
  year0Edited: number;
  year1Edited: number;
  year2Edited: number;
  year3Edited: number;
  year4Edited: number;
  year5Edited: number;
  year6Edited: number;
  year7Edited: number;
  year8Edited: number;
  year9Edited: number;
  dataCitation: string;
  reportedRows: Array<number>;
  year0Default: number;
  year0Formula: jsonLogic.RulesLogic;
  year1Default: number;
  year1Formula: jsonLogic.RulesLogic;
  year2Default: number;
  year2Formula: jsonLogic.RulesLogic;
  year3Default: number;
  year3Formula: jsonLogic.RulesLogic;
  year4Default: number;
  year4Formula: jsonLogic.RulesLogic;
  year5Default: number;
  year5Formula: jsonLogic.RulesLogic;
  year6Default: number;
  year6Formula: jsonLogic.RulesLogic;
  year7Default: number;
  year7Formula: jsonLogic.RulesLogic;
  year8Default: number;
  year8Formula: jsonLogic.RulesLogic;
  year9Default: number;
  year9Formula: jsonLogic.RulesLogic;
  dependentRows: Array<number>;
  dataSourceDefault: number;
}
