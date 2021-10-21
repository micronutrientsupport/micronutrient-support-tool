import { EnumTools } from 'src/utility/enumTools';
import { QuickMapsQueryParamKey } from '../quickMapsQueryParamKey.enum';
import { Converter } from './converter.abstract';

export class EnumConverter<EnumType> extends Converter<EnumType> {
  constructor(
    queryStringkey: QuickMapsQueryParamKey,
    protected readonly enumerator: Record<string, unknown>,
    protected readonly isStringEnumerator: boolean,
  ) {
    super(queryStringkey);
  }

  public getString(): string {
    return String(this.item);
  }
  public getItem(): Promise<EnumType> {
    return Promise.resolve(
      EnumTools.getEnumFromValue<EnumType>(
        this.isStringEnumerator ? this.stringValue : Number(this.stringValue),
        this.enumerator,
      ),
    );
  }
}
