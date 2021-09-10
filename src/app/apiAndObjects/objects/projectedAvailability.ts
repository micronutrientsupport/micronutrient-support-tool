import { BaseObject } from '../_lib_code/objects/baseObject';
import { Exportable } from './exportable.interface';

export class ProjectedAvailability extends BaseObject implements Exportable {
  public static readonly KEYS = {
    COUNTRY: 'country',
    YEAR: 'year',
    SCENARIO: 'scenario',
    DATA_SUFFIX: 'Diff',
  };

  public readonly country: string;
  public readonly year: number;
  public readonly scenario: string;

  public readonly data: Record<string, ValDiff> = {};

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.country = this._getString(ProjectedAvailability.KEYS.COUNTRY);
    this.year = this._getNumber(ProjectedAvailability.KEYS.YEAR);
    this.scenario = this._getString(ProjectedAvailability.KEYS.SCENARIO);

    // iterate through object keys finding all with "Diff" suffix
    const suffix = ProjectedAvailability.KEYS.DATA_SUFFIX;
    Object.keys(sourceObject)
      .filter((key) => key.endsWith(suffix))
      .map((key) => key.substring(0, key.length - suffix.length))
      .forEach((key) => {
        this.data[key] = {
          value: this._getNumber(key),
          diff: this.getNumberOrNull(key + suffix),
        };
      });

    // console.debug(this.data);
  }

  public getExportObject(): Record<string, unknown> {
    // clone
    return JSON.parse(JSON.stringify(this._sourceObject)) as Record<string, unknown>;
  }
  public getExportFileName(): string {
    return 'ProjectedAvailabilityData';
  }

  private getNumberOrNull(key: string): number {
    return null == this._getValue(key) ? null : this._getNumber(key);
  }
}

export interface ValDiff {
  value: number;
  diff: number;
}
