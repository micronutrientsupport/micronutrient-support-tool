import { MAT_RADIO_DEFAULT_OPTIONS_FACTORY } from '@angular/material/radio';
import { Z_NEED_DICT } from 'zlib';
import { BaseObject } from '../_lib_code/objects/baseObject';

export class ProjectedAvailability extends BaseObject {
  public static readonly KEYS = {
    COUNTRY: 'country',
    YEAR: 'year',
    SCENARIO: 'scenario',
    CA: 'Ca',
    CA_DIFF: 'CaDiff',
    B9: 'B9',
    B9_DIFF: 'B9Diff',
    FE: 'FeDiff',
    FE_DIFF: 'FeDiff',
    MG: 'Mg',
    MG_DIFF: 'MgDiff',
    B3: 'B3',
    B3_DIFF: 'B3Diff',
    P: 'P',
    P_DIFF: 'PDiff',
    K: 'K',
    K_DIFF: 'KDiff',
    PROTEIN: 'Protein',
    PROTEIN_DIFF: 'ProteinDiff',
    B2: 'B2',
    B2_DIFF: 'B2Diff',
    B1: 'B1',
    B1_DIFF: 'B1_Diff',
    A: 'A',
    A_DIFF: 'ADiff',
    B6: 'B6',
    B6_DIFF: 'B6Diff',
    C: 'C',
    C_DIFF: 'CDiff',
    ZN: 'Zn',
    ZN_DIFF: 'ZnDiff',
  };

  public country: string;
  public year: number;
  public scenario: string;
  public ca: number;
  public caDiff: number;
  public Fe: number;
  public FeDiff: number;
  public B9: number;
  public B9Diff: number;
  public Mg: number;
  public MgDiff: number;
  public B3: number;
  public B3Diff: number;
  public P: number;
  public PDiff: number;
  public K: number;
  public KDiff: number;
  public Protein: number;
  public ProteinDiff: number;
  public B2: number;
  public B2Diff: number;
  public A: number;
  public ADiff: number;
  public B1: number;
  public B1Diff: number;
  public B6: number;
  public B6Diff: number;
  public C: number;
  public CDiff: number;
  public Zn: number;
  public ZnDiff: number;

  public static makeItemFromObject(source: Record<string, unknown>): ProjectedAvailability {
    return super.makeItemFromObject(source) as ProjectedAvailability;
  }

  protected populateValues(): void {
    void super.populateValues();

    this.country = this._getString(ProjectedAvailability.KEYS.COUNTRY);
    this.year = this._getNumber(ProjectedAvailability.KEYS.YEAR);
    this.scenario = this._getString(ProjectedAvailability.KEYS.SCENARIO);
    this.ca = this._getNumber(ProjectedAvailability.KEYS.CA);
    this.caDiff =
      null == this._getValue(ProjectedAvailability.KEYS.CA_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.CA_DIFF);
    this.Fe = this._getNumber(ProjectedAvailability.KEYS.FE);
    this.FeDiff =
      null == this._getValue(ProjectedAvailability.KEYS.FE_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.FE_DIFF);
    this.Mg = this._getNumber(ProjectedAvailability.KEYS.MG);
    this.MgDiff =
      null == this._getValue(ProjectedAvailability.KEYS.MG_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.MG_DIFF);
    this.B1 = this._getNumber(ProjectedAvailability.KEYS.B1);
    this.B1Diff =
      null == this._getValue(ProjectedAvailability.KEYS.B1_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.B1_DIFF);
    this.B2 = this._getNumber(ProjectedAvailability.KEYS.B2);
    this.B2Diff =
      null == this._getValue(ProjectedAvailability.KEYS.B2_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.B2_DIFF);
    this.B3 = this._getNumber(ProjectedAvailability.KEYS.B3);
    this.B3Diff =
      null == this._getValue(ProjectedAvailability.KEYS.B3_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.B3_DIFF);
    this.B6 = this._getNumber(ProjectedAvailability.KEYS.B6);
    this.B6Diff =
      null == this._getValue(ProjectedAvailability.KEYS.B6_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.B6_DIFF);
    this.B9 = this._getNumber(ProjectedAvailability.KEYS.B9);
    this.B9Diff =
      null == this._getValue(ProjectedAvailability.KEYS.B9_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.B9_DIFF);
    this.A = this._getNumber(ProjectedAvailability.KEYS.A);
    this.ADiff =
      null == this._getValue(ProjectedAvailability.KEYS.A_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.A_DIFF);
    this.C = this._getNumber(ProjectedAvailability.KEYS.C);
    this.CDiff =
      null == this._getValue(ProjectedAvailability.KEYS.C_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.C_DIFF);
    this.K = this._getNumber(ProjectedAvailability.KEYS.K);
    this.KDiff =
      null == this._getValue(ProjectedAvailability.KEYS.K_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.K_DIFF);
    this.P = this._getNumber(ProjectedAvailability.KEYS.P);
    this.PDiff =
      null == this._getValue(ProjectedAvailability.KEYS.P_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.P_DIFF);
    this.Protein = this._getNumber(ProjectedAvailability.KEYS.PROTEIN);
    this.ProteinDiff =
      null == this._getValue(ProjectedAvailability.KEYS.PROTEIN_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.PROTEIN_DIFF);
    this.Zn = this._getNumber(ProjectedAvailability.KEYS.ZN);
    this.ZnDiff =
      null == this._getValue(ProjectedAvailability.KEYS.ZN_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.ZN_DIFF);
  }
}
