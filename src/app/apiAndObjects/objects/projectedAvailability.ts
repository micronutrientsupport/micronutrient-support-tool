import { BaseObject } from '../_lib_code/objects/baseObject';

export class ProjectedAvailability extends BaseObject {
  public static readonly KEYS = {
    COUNTRY: 'country',
    YEAR: 'year',
    SCENARIO: 'scenario',
    CA: 'Ca',
    CA_DIFF: 'CaDiff',
  };

  public country: string;
  public year: number;
  public scenario: string;
  public ca: number;
  public caDiff: number;


  public static makeItemFromObject(source: Record<string, unknown>): ProjectedAvailability {
    return super.makeItemFromObject(source) as ProjectedAvailability;
  }

  protected populateValues(): void {
    void super.populateValues();

    this.country = this._getString(ProjectedAvailability.KEYS.COUNTRY);
    this.year = this._getNumber(ProjectedAvailability.KEYS.YEAR);
    this.scenario = this._getString(ProjectedAvailability.KEYS.SCENARIO);
    this.ca = this._getNumber(ProjectedAvailability.KEYS.CA);
    this.caDiff = (null == this._getValue(ProjectedAvailability.KEYS.CA_DIFF))
      ? null : this._getNumber(ProjectedAvailability.KEYS.CA_DIFF);
  }

}
