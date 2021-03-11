
export interface ColourGradientObject {
  lessThanTestValue: number;
  hexString: string;
}

export class ColourGradient {
  public readonly gradientObjects = new Array<ColourGradientObject>();

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly lessThanTestValues: Array<number>,
    public readonly colors: Array<string>,
  ) {
    if (lessThanTestValues.length !== colors.length) {
      throw new Error('Error');
    }

    this.gradientObjects = lessThanTestValues
      // eslint-disable-next-line arrow-body-style
      .map((val: number, index: number) => {
        return {
          lessThanTestValue: val,
          hexString: colors[index],
        };
      })
      .filter(thisColGradObj => (null != thisColGradObj.lessThanTestValue) && (null != thisColGradObj.hexString))
      .sort((a, b) => (a.lessThanTestValue < b.lessThanTestValue) ? -1 : 1);

  }

  public getColour(value: number): string {
    const colGradObj = this.gradientObjects.find(thisColGradObj => {
      // console.debug('getColour test', value, thisColGradObj);
      return (value < thisColGradObj.lessThanTestValue);
    });
    // console.debug('getColour', value, colGradObj);
    return (null != colGradObj) ? colGradObj.hexString : '';
  }
}
