import { BaseObject } from '../_lib_code/objects/baseObject';
import { Exportable } from './exportable.interface';

export class DietaryHouseholdSummary extends BaseObject implements Exportable {
  public static readonly KEYS = {
    DIETARY_SUPPLY: 'dietarySupply',
    DEFICIENT_VALUE: 'deficientValue',
    IS_DEFICIENT: 'isDeficient',
    MICRONUTRIENT_ID: 'micronutrientId',
    CONSUMPTION_DATA_ID: 'consumptionDataId',
    COMPOSITION_DATA_ID: 'compositionDataId',
  };

  public readonly dietarySupply: number;
  public readonly deficientValue: number;
  public readonly isDeficient: boolean;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.dietarySupply = this._getNumber(DietaryHouseholdSummary.KEYS.DIETARY_SUPPLY);
    this.deficientValue = this._getNumber(DietaryHouseholdSummary.KEYS.DEFICIENT_VALUE);
    this.isDeficient = this._getBoolean(DietaryHouseholdSummary.KEYS.IS_DEFICIENT);
  }

  public getExportObject(): Record<string, unknown> {
    const exportObject = JSON.parse(JSON.stringify(this)) as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/dot-notation, @typescript-eslint/no-unsafe-member-access
    delete exportObject['_sourceObject'];
    return exportObject;
  }
  public getExportFileName(): string {
    return 'MonthlyFoodData';
  }
}
