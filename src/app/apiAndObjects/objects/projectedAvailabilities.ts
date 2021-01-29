import { BaseObject } from '../_lib_code/objects/baseObject';
import { ProjectedAvailability } from './projectedAvailability';

export class ProjectedAvailabilities extends BaseObject {
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

  public year2010: ProjectedAvailability;
  public year2015: ProjectedAvailability;
  public year2020: ProjectedAvailability;
  public year2025: ProjectedAvailability;
  public year2030: ProjectedAvailability;
  public year2035: ProjectedAvailability;
  public year2040: ProjectedAvailability;
  public year2045: ProjectedAvailability;
  public year2050: ProjectedAvailability;

  public all = new Array<ProjectedAvailability>();

  public static makeItemFromObject(source: Record<string, unknown>): ProjectedAvailabilities {
    return super.makeItemFromObject(source) as ProjectedAvailabilities;
  }

  protected populateValues(): void {
    void super.populateValues();

    this.year2010 = this.makeProjectedAvailability(ProjectedAvailabilities.KEYS.year2010);
    this.year2015 = this.makeProjectedAvailability(ProjectedAvailabilities.KEYS.year2015);
    this.year2020 = this.makeProjectedAvailability(ProjectedAvailabilities.KEYS.year2020);
    this.year2025 = this.makeProjectedAvailability(ProjectedAvailabilities.KEYS.year2025);
    this.year2030 = this.makeProjectedAvailability(ProjectedAvailabilities.KEYS.year2030);
    this.year2035 = this.makeProjectedAvailability(ProjectedAvailabilities.KEYS.year2035);
    this.year2040 = this.makeProjectedAvailability(ProjectedAvailabilities.KEYS.year2040);
    this.year2045 = this.makeProjectedAvailability(ProjectedAvailabilities.KEYS.year2045);
    this.year2050 = this.makeProjectedAvailability(ProjectedAvailabilities.KEYS.year2050);
  }

  private makeProjectedAvailability(key: string): ProjectedAvailability {
    const country = 'AGO';
    const group = ProjectedAvailability.makeFromObject(
      country,
      Number(key),
      this._getValue(key) as Record<string, unknown>,
    );
    this.all.push(group);
    return group;
  }
}
