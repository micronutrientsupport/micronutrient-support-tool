import { ColourPalette } from './colourPalette';

export interface ColourGradientObject {
  lessThanTestValue: number;
  hexString: string;
}

export class ColourGradient {
  public readonly gradientObjects = new Array<ColourGradientObject>();

  constructor(
    public readonly lessThanTestValues: Array<number>,
    public colors: ColourPalette,
  ) {
    const colorArray = colors.generateColors(lessThanTestValues.length);

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

    // console.debug(this.gradientObjects);
  }

  public getColour(value: number): string {
    const intValue = Number(value);
    const colGradObj = this.gradientObjects.find((thisColGradObj) => {
      // console.debug('getColour 1', value, thisColGradObj);
      // console.debug('value', intValue < thisColGradObj.lessThanTestValue);dd
      return intValue < thisColGradObj.lessThanTestValue;
    });
    // console.debug('getColour', intValue, colGradObj);
    return null != colGradObj ? colGradObj.hexString : '';
  }
}
