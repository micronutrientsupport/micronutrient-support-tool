import { BaseObject } from '../_lib_code/objects/baseObject';

export class DietarySource extends BaseObject {
  public static readonly KEYS = {
    SUPPLY_TOTAL: 'mn_supply_total',
    SUPPLY_UNIT: 'mn_supply_unit',
    CEREAL_GRAINS_PERC: 'mn_cereal_grains_perc',
    TUBERS_PERC: 'mn_tubers_perc',
    NUTS_PERC: 'mn_nuts_perc',
    VEG_PERC: 'mn_vegetables_perc',
    MEAT_PERC: 'mn_meat_perc',
    FRUIT_PERC: 'mn_fruit_perc',
    DAIRY_PERC: 'mn_dairy_perc',
    FAT_PERC: 'mn_fat_perc',
    MISC_PERC: 'mn_misc_perc',
    PERC_UNIT: 'mn_unit_perc',
  };

  public supplyTotal: number;
  public supplyUnits: string;
  public cerealsPerc: number;
  public tubersPerc: number;
  public nutsPerc: number;
  public vegPerc: number;
  public meatPerc: number;
  public fruitPerc: number;
  public dairyPerc: number;
  public fatPerc: number;
  public miscPerc: number;
  public percUnit: string;

  public static makeItemFromObject(source: Record<string, unknown>): DietarySource {
    return super.makeItemFromObject(source) as DietarySource;
  }

  protected populateValues(): void {
    void super.populateValues();

    this.supplyTotal = this._getNumber(DietarySource.KEYS.SUPPLY_TOTAL);
    this.supplyUnits = this._getString(DietarySource.KEYS.SUPPLY_UNIT);
    this.cerealsPerc = this._getNumber(DietarySource.KEYS.CEREAL_GRAINS_PERC);
    this.tubersPerc = this._getNumber(DietarySource.KEYS.TUBERS_PERC);
    this.nutsPerc = this._getNumber(DietarySource.KEYS.NUTS_PERC);
    this.vegPerc = this._getNumber(DietarySource.KEYS.VEG_PERC);
    this.meatPerc = this._getNumber(DietarySource.KEYS.MEAT_PERC);
    this.fruitPerc = this._getNumber(DietarySource.KEYS.FRUIT_PERC);
    this.dairyPerc = this._getNumber(DietarySource.KEYS.DAIRY_PERC);
    this.fatPerc = this._getNumber(DietarySource.KEYS.FAT_PERC);
    this.miscPerc = this._getNumber(DietarySource.KEYS.MISC_PERC);
    this.percUnit = this._getString(DietarySource.KEYS.PERC_UNIT);
  }
}
