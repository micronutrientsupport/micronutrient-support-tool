import { BaseObject } from '../_lib_code/objects/baseObject';
import { MonthlyFoodGroup } from './monthlyFoodGroup';

export class MonthlyFoodGroups extends BaseObject {
  public static readonly KEYS = {
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

    this.jan = this.makeMonthlyFoodGroup(MonthlyFoodGroups.KEYS.JAN);
    this.feb = this.makeMonthlyFoodGroup(MonthlyFoodGroups.KEYS.FEB);
    this.mar = this.makeMonthlyFoodGroup(MonthlyFoodGroups.KEYS.MAR);
    this.apr = this.makeMonthlyFoodGroup(MonthlyFoodGroups.KEYS.APR);
    this.may = this.makeMonthlyFoodGroup(MonthlyFoodGroups.KEYS.MAY);
    this.jun = this.makeMonthlyFoodGroup(MonthlyFoodGroups.KEYS.JUN);
    this.jul = this.makeMonthlyFoodGroup(MonthlyFoodGroups.KEYS.JUL);
    this.aug = this.makeMonthlyFoodGroup(MonthlyFoodGroups.KEYS.AUG);
    this.sep = this.makeMonthlyFoodGroup(MonthlyFoodGroups.KEYS.SEP);
    this.oct = this.makeMonthlyFoodGroup(MonthlyFoodGroups.KEYS.OCT);
    this.nov = this.makeMonthlyFoodGroup(MonthlyFoodGroups.KEYS.NOV);
    this.dec = this.makeMonthlyFoodGroup(MonthlyFoodGroups.KEYS.DEC);
  }

  private makeMonthlyFoodGroup(key: string): MonthlyFoodGroup {
    const group = MonthlyFoodGroup.makeFromObject(key, this._getValue(key) as Record<string, unknown>);
    this.all.push(group);
    return group;
  }
}
