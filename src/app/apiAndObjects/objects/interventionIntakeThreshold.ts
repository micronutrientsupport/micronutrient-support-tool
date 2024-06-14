import { BaseObject } from '../_lib_code/objects/baseObject';

export class InterventionIntakeThreshold extends BaseObject {
  public static readonly KEYS = {
    INTERVENTION_ID: 'interventionId',
    UNIT_ADEQUACY: 'unitAdequacy',
    UNIT_EXCESS: 'unitExcess',
    UNIT_CND: 'unitCnd',
    REFERENCE_PERSON: 'referencePerson',
    EAR: 'ear',
    EAR_DEFAULT: 'earDefault',
    UL: 'ul',
    UL_DEFAULT: 'ulDefault',
    CND: 'CND',
    CUL: 'CUL',
    ENERGY: 'energy',
    ENERGY_DEFAULT: 'energyDefault',
    NOTES: 'notes',
    SOURCE: 'source',
  };

  public readonly interventionId: number;
  public readonly unitAdequacy: string;
  public readonly unitExcess: string;
  public readonly unitCnd: string;
  public readonly ear: number;
  public readonly earDefault: number;
  public readonly ul: number;
  public readonly ulDefault: number;
  public readonly cnd: number;
  public readonly cul: number;
  public readonly energy: number;
  public readonly energyDefault: number;
  public readonly notes: string;
  public readonly source: string;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.interventionId = this._getNumber(InterventionIntakeThreshold.KEYS.INTERVENTION_ID);
    this.unitAdequacy = this._getString(InterventionIntakeThreshold.KEYS.UNIT_ADEQUACY);
    this.unitExcess = this._getString(InterventionIntakeThreshold.KEYS.UNIT_EXCESS);
    this.unitCnd = this._getString(InterventionIntakeThreshold.KEYS.UNIT_CND);

    this.ear = this._getNumber(InterventionIntakeThreshold.KEYS.EAR);
    this.earDefault = this._getNumber(InterventionIntakeThreshold.KEYS.EAR_DEFAULT);
    this.ul = this._getNumber(InterventionIntakeThreshold.KEYS.UL);
    this.ulDefault = this._getNumber(InterventionIntakeThreshold.KEYS.UL_DEFAULT);
    this.cnd = this._getNumber(InterventionIntakeThreshold.KEYS.CND);
    this.cul = this._getNumber(InterventionIntakeThreshold.KEYS.CUL);
    this.energy = this._getNumber(InterventionIntakeThreshold.KEYS.ENERGY);
    this.energyDefault = this._getNumber(InterventionIntakeThreshold.KEYS.ENERGY_DEFAULT);

    this.notes = this._getString(InterventionIntakeThreshold.KEYS.NOTES);
    this.source = this._getString(InterventionIntakeThreshold.KEYS.SOURCE);
  }
}
