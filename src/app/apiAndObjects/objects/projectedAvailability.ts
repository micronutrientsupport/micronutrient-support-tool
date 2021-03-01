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
    FE: 'Fe',
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

  public readonly country: string;
  public readonly year: number;
  public readonly scenario: string;
  public readonly ca: number;
  public readonly caDiff: number;
  public readonly fe: number;
  public readonly feDiff: number;
  public readonly b9: number;
  public readonly b9Diff: number;
  public readonly mg: number;
  public readonly mgDiff: number;
  public readonly b3: number;
  public readonly b3Diff: number;
  public readonly p: number;
  public readonly pDiff: number;
  public readonly k: number;
  public readonly kDiff: number;
  public readonly protein: number;
  public readonly proteinDiff: number;
  public readonly b2: number;
  public readonly b2Diff: number;
  public readonly a: number;
  public readonly aDiff: number;
  public readonly b1: number;
  public readonly b1Diff: number;
  public readonly b6: number;
  public readonly b6Diff: number;
  public readonly c: number;
  public readonly cDiff: number;
  public readonly zn: number;
  public readonly znDiff: number;

  protected constructor(
    sourceObject?: Record<string, unknown>,
  ) {
    super(sourceObject);

    this.country = this._getString(ProjectedAvailability.KEYS.COUNTRY);
    this.year = this._getNumber(ProjectedAvailability.KEYS.YEAR);
    this.scenario = this._getString(ProjectedAvailability.KEYS.SCENARIO);
    this.ca = this._getNumber(ProjectedAvailability.KEYS.CA);
    this.caDiff =
      null == this._getValue(ProjectedAvailability.KEYS.CA_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.CA_DIFF);
    this.fe = this._getNumber(ProjectedAvailability.KEYS.FE);
    this.feDiff =
      null == this._getValue(ProjectedAvailability.KEYS.FE_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.FE_DIFF);
    this.mg = this._getNumber(ProjectedAvailability.KEYS.MG);
    this.mgDiff =
      null == this._getValue(ProjectedAvailability.KEYS.MG_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.MG_DIFF);
    this.b1 = this._getNumber(ProjectedAvailability.KEYS.B1);
    this.b1Diff =
      null == this._getValue(ProjectedAvailability.KEYS.B1_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.B1_DIFF);
    this.b2 = this._getNumber(ProjectedAvailability.KEYS.B2);
    this.b2Diff =
      null == this._getValue(ProjectedAvailability.KEYS.B2_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.B2_DIFF);
    this.b3 = this._getNumber(ProjectedAvailability.KEYS.B3);
    this.b3Diff =
      null == this._getValue(ProjectedAvailability.KEYS.B3_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.B3_DIFF);
    this.b6 = this._getNumber(ProjectedAvailability.KEYS.B6);
    this.b6Diff =
      null == this._getValue(ProjectedAvailability.KEYS.B6_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.B6_DIFF);
    this.b9 = this._getNumber(ProjectedAvailability.KEYS.B9);
    this.b9Diff =
      null == this._getValue(ProjectedAvailability.KEYS.B9_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.B9_DIFF);
    this.a = this._getNumber(ProjectedAvailability.KEYS.A);
    this.aDiff =
      null == this._getValue(ProjectedAvailability.KEYS.A_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.A_DIFF);
    this.c = this._getNumber(ProjectedAvailability.KEYS.C);
    this.cDiff =
      null == this._getValue(ProjectedAvailability.KEYS.C_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.C_DIFF);
    this.k = this._getNumber(ProjectedAvailability.KEYS.K);
    this.kDiff =
      null == this._getValue(ProjectedAvailability.KEYS.K_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.K_DIFF);
    this.p = this._getNumber(ProjectedAvailability.KEYS.P);
    this.pDiff =
      null == this._getValue(ProjectedAvailability.KEYS.P_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.P_DIFF);
    this.protein = this._getNumber(ProjectedAvailability.KEYS.PROTEIN);
    this.proteinDiff =
      null == this._getValue(ProjectedAvailability.KEYS.PROTEIN_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.PROTEIN_DIFF);
    this.zn = this._getNumber(ProjectedAvailability.KEYS.ZN);
    this.znDiff =
      null == this._getValue(ProjectedAvailability.KEYS.ZN_DIFF)
        ? null
        : this._getNumber(ProjectedAvailability.KEYS.ZN_DIFF);
  }
}
