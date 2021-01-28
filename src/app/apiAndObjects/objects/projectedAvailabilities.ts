import { BaseObject } from '../_lib_code/objects/baseObject';
import { projectedAvailability } from './projectedAvailability';

export class projectedAvailabilities extends BaseObject {
  public static readonly KEYS = {
    year2010: '2010',
    year2015: '2015',
    year2020: '2020',
    year2025: '2025',
    year2030: '2030',
    year2035: '2035',
    year2040: '2040',
    year2045: '2045',
    year2050: '2050',
  };

  public year2010: projectedAvailability;
  public year2015: projectedAvailability;
  public year2020: projectedAvailability;
  public year2025: projectedAvailability;
  public year2030: projectedAvailability;
  public year2035: projectedAvailability;
  public year2040: projectedAvailability;
  public year2045: projectedAvailability;
  public year2050: projectedAvailability;

  public all = new Array<projectedAvailability>();

  public static makeItemFromObject(source: Record<string, unknown>): projectedAvailabilities {
    return super.makeItemFromObject(source) as projectedAvailabilities;
  }

  protected populateValues(): void {
    void super.populateValues();

    this.year2010 = this.makeProjectedAvailability(projectedAvailabilities.KEYS.year2010);
    this.year2015 = this.makeProjectedAvailability(projectedAvailabilities.KEYS.year2015);
    this.year2020 = this.makeProjectedAvailability(projectedAvailabilities.KEYS.year2020);
    this.year2025 = this.makeProjectedAvailability(projectedAvailabilities.KEYS.year2025);
    this.year2030 = this.makeProjectedAvailability(projectedAvailabilities.KEYS.year2030);
    this.year2035 = this.makeProjectedAvailability(projectedAvailabilities.KEYS.year2035);
    this.year2040 = this.makeProjectedAvailability(projectedAvailabilities.KEYS.year2040);
    this.year2045 = this.makeProjectedAvailability(projectedAvailabilities.KEYS.year2045);
    this.year2050 = this.makeProjectedAvailability(projectedAvailabilities.KEYS.year2050);
  }

  private makeProjectedAvailability(key: string): projectedAvailability {
    const group = projectedAvailability.makeFromObject(key, this._getValue(key) as Record<string, unknown>);
    this.all.push(group);
    return group;
  }
}
