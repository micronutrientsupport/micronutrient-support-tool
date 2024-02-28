import { BaseObject } from '../_lib_code/objects/baseObject';

export class InterventionFortificantLevel extends BaseObject {
  public static readonly KEYS = {
    INTERVENTION_ID: 'interventionId',
    ROW_INDEX: 'rowIndex',
    FORTIFICANT_ID: 'fortificantId',
    FORTIFICANT_COMPOUND: 'fortificantCompound',
    FORTIFICANT_ACTIVITY: 'fortificantActivity',
    FORTIFICANT_OVERAGE: 'fortificantOverage',
    FORTIFICANT_MICRONUTRIENT: 'fortificantMicronutrient',
    FORTIFICANT_AMOUNT: 'fortificantAmount',
    FORTIFICANT_PROPORTION: 'fortificantProportion',
    FORTIFICANT_PRICE: 'fortificantPrice',
    FORTIFICATION_LEVEL: 'fortificationLevel',
  };

  public readonly rowIndex: number;
  public readonly interventionId: number;
  public readonly fortificantId: number;
  public readonly fortificantCompound: string;
  public fortificantActivity: number;
  public readonly fortificantMicronutrient: string;
  public readonly fortificantAmount: number;
  public readonly fortificantProportion: number;
  public fortificantPrice: number;
  public fortificantOverage: number;
  public fortificationLevel: number;

  protected constructor(sourceObject?: Record<string, unknown>) {
    console.log(sourceObject);
    super(sourceObject);

    console.log(this);

    this.rowIndex = this._getNumber(InterventionFortificantLevel.KEYS.ROW_INDEX);
    this.interventionId = this._getNumber(InterventionFortificantLevel.KEYS.INTERVENTION_ID);
    this.fortificantId = this._getNumber(InterventionFortificantLevel.KEYS.FORTIFICANT_ID);
    this.fortificantCompound = this._getString(InterventionFortificantLevel.KEYS.FORTIFICANT_COMPOUND);
    this.fortificantActivity = this._getNumber(InterventionFortificantLevel.KEYS.FORTIFICANT_ACTIVITY);
    this.fortificantMicronutrient = this._getString(InterventionFortificantLevel.KEYS.FORTIFICANT_MICRONUTRIENT);
    this.fortificantAmount = this._getNumber(InterventionFortificantLevel.KEYS.FORTIFICANT_AMOUNT);
    this.fortificantProportion = this._getNumber(InterventionFortificantLevel.KEYS.FORTIFICANT_PROPORTION);
    this.fortificantPrice = this._getNumber(InterventionFortificantLevel.KEYS.FORTIFICANT_PRICE);
    this.fortificantOverage = this._getNumber(InterventionFortificantLevel.KEYS.FORTIFICANT_OVERAGE);
    this.fortificationLevel = this._getValue(InterventionFortificantLevel.KEYS.FORTIFICATION_LEVEL) as number;

    console.log(this);
  }

  public static makeExcipient(sourceObject?: Record<string, unknown>) {
    return new InterventionFortificantLevel(sourceObject);
  }
}
