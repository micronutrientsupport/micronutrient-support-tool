export class MonthlyFoodGroup {
  constructor(
    public readonly month: string,
    public readonly monthIndex: number,
    public readonly supplyTotal: number,
    public readonly supplyUnit: string,
    public readonly cerealGrainsPerc: number,
    public readonly tubersPerc: number,
    public readonly nutsPerc: number,
    public readonly vegetablesPerc: number,
    public readonly meatPerc: number,
    public readonly fruitPerc: number,
    public readonly dairyPerc: number,
    public readonly fatPerc: number,
    public readonly miscPerc: number,
    public readonly unitPerc: number,
  ) {}

  public static makeFromObject(month: string, monthIndex: number, obj: Record<string, unknown>): MonthlyFoodGroup {
    return new MonthlyFoodGroup(
      this.uppercaseFirst(month),
      monthIndex,
      obj.mn_supply_total as number,
      obj.mn_supply_unit as string,
      obj.mn_cereal_grains_perc as number,
      obj.mn_tubers_perc as number,
      obj.mn_nuts_perc as number,
      obj.mn_vegetables_perc as number,
      obj.mn_meat_perc as number,
      obj.mn_fruit_perc as number,
      obj.mn_dairy_perc as number,
      obj.mn_fat_perc as number,
      obj.mn_misc_perc as number,
      obj.mn_unit_perc as number,
    );
  }

  private static uppercaseFirst(value: string): string {
    return typeof value !== 'string' ? '' : value.charAt(0).toUpperCase() + value.slice(1);
  }
}
