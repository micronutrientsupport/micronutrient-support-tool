import { BaseObject } from '../_lib_code/objects/baseObject';

export class InterventionProjectedHouseholds extends BaseObject {
  public static readonly KEYS = {
    COUNTRY_ID: 'countryId',
    AREA_NAME: 'name',
    ADMIN_LEVEL: 'adminLevel',
    POPULATION_2021: 'population2021',
    POPULATION_2022: 'population2022',
    POPULATION_2023: 'population2023',
    POPULATION_2024: 'population2024',
    POPULATION_2025: 'population2025',
    POPULATION_2026: 'population2026',
    POPULATION_2027: 'population2027',
    POPULATION_2028: 'population2028',
    POPULATION_2029: 'population2029',
    POPULATION_2030: 'population2030',
    POPULATION_2031: 'population2031',
    POPULATION_2032: 'population2032',
    POPULATION_2033: 'population2033',
    POPULATION_2034: 'population2034',
    POPULATION_2035: 'population2035',
  };

  public readonly countryId: string;
  public readonly areaName: string;
  public readonly adminLevel: number;
  public readonly population2021: number;
  public readonly population2022: number;
  public readonly population2023: number;
  public readonly population2024: number;
  public readonly population2025: number;
  public readonly population2026: number;
  public readonly population2027: number;
  public readonly population2028: number;
  public readonly population2029: number;
  public readonly population2030: number;
  public readonly population2031: number;
  public readonly population2032: number;
  public readonly population2033: number;
  public readonly population2034: number;
  public readonly population2035: number;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.countryId = this._getString(InterventionProjectedHouseholds.KEYS.COUNTRY_ID);
    this.areaName = this._getString(InterventionProjectedHouseholds.KEYS.AREA_NAME);
    this.adminLevel = this._getNumber(InterventionProjectedHouseholds.KEYS.ADMIN_LEVEL);
    this.population2021 = this._getNumber(InterventionProjectedHouseholds.KEYS.POPULATION_2021);
    this.population2022 = this._getNumber(InterventionProjectedHouseholds.KEYS.POPULATION_2022);
    this.population2023 = this._getNumber(InterventionProjectedHouseholds.KEYS.POPULATION_2023);
    this.population2024 = this._getNumber(InterventionProjectedHouseholds.KEYS.POPULATION_2024);
    this.population2025 = this._getNumber(InterventionProjectedHouseholds.KEYS.POPULATION_2025);
    this.population2026 = this._getNumber(InterventionProjectedHouseholds.KEYS.POPULATION_2026);
    this.population2027 = this._getNumber(InterventionProjectedHouseholds.KEYS.POPULATION_2027);
    this.population2028 = this._getNumber(InterventionProjectedHouseholds.KEYS.POPULATION_2028);
    this.population2029 = this._getNumber(InterventionProjectedHouseholds.KEYS.POPULATION_2029);
    this.population2030 = this._getNumber(InterventionProjectedHouseholds.KEYS.POPULATION_2030);
    this.population2031 = this._getNumber(InterventionProjectedHouseholds.KEYS.POPULATION_2031);
    this.population2032 = this._getNumber(InterventionProjectedHouseholds.KEYS.POPULATION_2032);
    this.population2033 = this._getNumber(InterventionProjectedHouseholds.KEYS.POPULATION_2033);
    this.population2034 = this._getNumber(InterventionProjectedHouseholds.KEYS.POPULATION_2034);
    this.population2035 = this._getNumber(InterventionProjectedHouseholds.KEYS.POPULATION_2035);
  }
}
