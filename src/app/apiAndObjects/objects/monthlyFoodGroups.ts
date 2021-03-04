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

  public readonly jan: MonthlyFoodGroup;
  public readonly feb: MonthlyFoodGroup;
  public readonly mar: MonthlyFoodGroup;
  public readonly apr: MonthlyFoodGroup;
  public readonly may: MonthlyFoodGroup;
  public readonly jun: MonthlyFoodGroup;
  public readonly jul: MonthlyFoodGroup;
  public readonly aug: MonthlyFoodGroup;
  public readonly sep: MonthlyFoodGroup;
  public readonly oct: MonthlyFoodGroup;
  public readonly nov: MonthlyFoodGroup;
  public readonly dec: MonthlyFoodGroup;

  public readonly all = new Array<MonthlyFoodGroup>();

  protected constructor(
    sourceObject?: Record<string, unknown>,
  ) {
    super(sourceObject);

    this.all = Object.values(MonthlyFoodGroups.MONTH_KEYS).map((monthKey: string, index: number) =>
      MonthlyFoodGroup.makeFromObject(monthKey, index + 1, this._getValue(monthKey) as Record<string, unknown>)
    );

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
