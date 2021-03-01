import { BaseObject } from '../_lib_code/objects/baseObject';
import { MonthlyFoodGroup } from './monthlyFoodGroup';

export class MonthlyFoodGroups extends BaseObject {
  public static readonly MONTH_KEYS = {
    JAN: 'jan',
    FEB: 'feb',
    MAR: 'mar',
    APR: 'apr',
    MAY: 'may',
    JUN: 'jun',
    JUL: 'jul',
    AUG: 'aug',
    SEP: 'sep',
    OCT: 'oct',
    NOV: 'nov',
    DEC: 'dec',
  };
  public static readonly KEYS = {
    ...MonthlyFoodGroups.MONTH_KEYS,
  };

  public jan: MonthlyFoodGroup;
  public feb: MonthlyFoodGroup;
  public mar: MonthlyFoodGroup;
  public apr: MonthlyFoodGroup;
  public may: MonthlyFoodGroup;
  public jun: MonthlyFoodGroup;
  public jul: MonthlyFoodGroup;
  public aug: MonthlyFoodGroup;
  public sep: MonthlyFoodGroup;
  public oct: MonthlyFoodGroup;
  public nov: MonthlyFoodGroup;
  public dec: MonthlyFoodGroup;

  public all = new Array<MonthlyFoodGroup>();

  public static makeItemFromObject(source: Record<string, unknown>): MonthlyFoodGroups {
    return super.makeItemFromObject(source) as MonthlyFoodGroups;
  }

  protected populateValues(): void {
    void super.populateValues();

    Object.values(MonthlyFoodGroups.MONTH_KEYS).forEach((monthKey: string, index: number) => {
      const group = MonthlyFoodGroup.makeFromObject(monthKey, index + 1, this._getValue(monthKey) as Record<string, unknown>);
      this.all.push(group);
    });
    const clone = this.all.slice();
    this.jan = clone.shift();
    this.feb = clone.shift();
    this.mar = clone.shift();
    this.apr = clone.shift();
    this.may = clone.shift();
    this.jun = clone.shift();
    this.jul = clone.shift();
    this.aug = clone.shift();
    this.sep = clone.shift();
    this.oct = clone.shift();
    this.nov = clone.shift();
    this.dec = clone.shift();
  }
}
