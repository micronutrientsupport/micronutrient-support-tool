import { StringNullableChain } from 'cypress/types/lodash';
import { BaseObject } from '../_lib_code/objects/baseObject';
import { DataLevel } from './enums/dataLevel.enum';
import { Named } from './named.interface';
import * as jsonLogic from 'json-logic-js';

export class InterventionCropTargetting extends BaseObject implements Named {
  public static readonly KEYS = {
    INTERVENTION_ID: 'interventionId',
    CROP_TARGETTING: 'cropTargetting',
  };

  public readonly name: string;
  public readonly dataLevel: DataLevel;

  public readonly interventionId: number;
  public readonly cropTargetting: Array<CropTargetting>;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.interventionId = this._getNumber(InterventionCropTargetting.KEYS.INTERVENTION_ID);
    this.cropTargetting = this._getArray(InterventionCropTargetting.KEYS.CROP_TARGETTING);
  }
}

export interface CropTargetting {
  region: string;
  is_region_targeted: boolean;
  zones_targeted: number;
  cultivation_area_ha: number;
  targeted_area_ha: number;
  regional_share_pc: number;
}
