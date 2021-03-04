export class EnumTools {

  public static getEnumFromValue<T>(value: string | number, enumerator: Record<string, unknown>): T {
    // get the string key from the value
    const key = Object.keys(enumerator).find((thisKey: string | number) => enumerator[thisKey] === value);
    return enumerator[key] as T;
  }
}
