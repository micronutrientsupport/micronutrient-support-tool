import { BaseObject } from '../_lib_code/objects/baseObject';

export class InterventionTemplates extends BaseObject {
  public static readonly KEYS = {
    TEMPLATES: 'templates',
  };

  public readonly templates: object;

  protected constructor(sourceObject?: Record<string, unknown>) {
    super(sourceObject);

    this.templates = this._getValue(InterventionTemplates.KEYS.TEMPLATES) as object;
  }
}
