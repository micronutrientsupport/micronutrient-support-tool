import { ColourPalette } from './colourPalette';

export interface ColourGradientObject {
  lessThanTestValue: number;
  hexString: string;
}

export class ColourGradient {
  public readonly gradientObjects = new Array<ColourGradientObject>();
  public readonly moreThanHex: string;

  constructor(
    public readonly lessThanTestValues: Array<number>,
    public colors: ColourPalette,
  ) {
    const colorArray = colors.generateColors(lessThanTestValues.length + 1);
    this.moreThanHex = colorArray.pop();

    this.gradientObjects = lessThanTestValues
      // eslint-disable-next-line arrow-body-style
      .map((val: number, index: number) => {
        return {
          lessThanTestValue: val,
          hexString: colorArray[index],
        };
      })
      .filter((thisColGradObj) => null != thisColGradObj.lessThanTestValue && null != thisColGradObj.hexString)
      .sort((a, b) => (a.lessThanTestValue < b.lessThanTestValue ? -1 : 1));
  }

  public getColour(value: number): string {
    const intValue = Number(value);
    const colGradObj = this.gradientObjects.find((thisColGradObj) =>
      intValue < thisColGradObj.lessThanTestValue
    );
    return null == colGradObj ? this.moreThanHex : colGradObj.hexString;
  }
}
