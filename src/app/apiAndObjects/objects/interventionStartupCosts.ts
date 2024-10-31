import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { Named } from './named.interface';
import * as jsonLogic from 'json-logic-js';

export class InterventionStartupCosts extends BaseObject implements Named {
  public static readonly KEYS = {
    INTERVENTION_ID: 'interventionId',
    STARTUP_COSTS: 'startupScaleupCosts',
  };

  public readonly name: string;
  public readonly dataLevel: DataLevel;

  public readonly interventionId: number;
  public readonly startupScaleupCosts: Array<StartUpScaleUpCost>;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.interventionId = this._getNumber(InterventionStartupCosts.KEYS.INTERVENTION_ID);
    this.startupScaleupCosts = this._getArray(InterventionStartupCosts.KEYS.STARTUP_COSTS);
    console.log(this.startupScaleupCosts);
  }
}
export interface StartUpScaleUpCost {
  category: StartUpScaleUpCostCategoryType;
  costs: Array<StartUpCosts>;
}

export enum StartUpScaleUpCostCategoryType {
  GOVERNMENT = 'Government-related start-up/scale-up costs',
  INDUSTRY = 'Industry-related start-up/scale-up costs',
  USER = 'User added start-up/scale-up costs',
}
export interface StartUpCosts {
  section: string;
  costBreakdown: Array<StartUpCostBreakdown>;
  year0Total: number;
  year0TotalFormula: jsonLogic.RulesLogic;
  year1Total: number;
  year1TotalFormula: jsonLogic.RulesLogic;
}

export interface StartUpCostBreakdown {
  labelText: string;
  rowIndex: number | string;
  year0: number;
  year0Default: number;
  year0Edited: number;
  year0Overriden: boolean;
  year1: number;
  year1Default: number;
  year1Edited: number;
  year1Overriden: boolean;
  rowUnits: string;
  isEditable: boolean;
  isCalculated: boolean;
  dataSource: string;
  dataSourceDefault: string;
  dataCitation: string;
}
interface StartupCostBreakdownConstructable {
  new (id: number): StartUpCostBreakdown;
}

export class UserStartupCostFactory implements StartUpCostBreakdown {
  labelText: string;
  rowIndex: number;
  year0: number;
  year0Default: number;
  year0Edited: number;
  year0Overriden: boolean;
  year1: number;
  year1Default: number;
  year1Edited: number;
  year1Overriden: boolean;
  year2: number;
  year2Default: number;
  year2Edited: number;
  year2Overriden: boolean;
  rowUnits: string;
  isEditable: boolean;
  isCalculated: boolean;
  dataSource: string;
  dataSourceDefault: string;
  dataCitation: string;

  constructor(public id: number) {
    this.labelText = 'New Cost';
    this.rowUnits = 'US dollars';
    (this.rowIndex as any) = `uecsn_${id}`;
    this.isCalculated = false;
    this.isEditable = true;
    this.year0 = 0;
    this.year0Default = 0;
    this.year0Edited = 0;
    this.year0Overriden = false;
    this.year1 = 0;
    this.year1Default = 0;
    this.year1Edited = 0;
    this.year1Overriden = false;
    this.year2 = 0;
    this.year2Default = 0;
    this.year2Edited = 0;
    this.year2Overriden = false;
  }
}

export function makeUserCost(cost: StartupCostBreakdownConstructable, id = -1) {
  return new cost(id);
}

export interface StartUpCostSummary {
  category: string;
  year0CombinedTotal: number;
  year1CombinedTotal: number;
}
