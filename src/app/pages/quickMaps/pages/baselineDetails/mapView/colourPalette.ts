/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import chroma from 'chroma-js';
import { ColourGradientType } from './colourGradientType.enum';

export const CUSTOM_PALETTE_NAME = 'Custom palette';
export class ColourPalette {
  constructor(
    public readonly name: ColourGradientType,
    public readonly colourHex: Array<string>,
  ) { }

  public generateColors(count: number): Array<string> {
    console.debug('call generate colours');
    // get array of colors from chroma.js
    return chroma
      .scale(this.colourHex)
      .colors(count) as Array<string>;
  };

  public generateColorsForDisplay(count = 8): Array<HTMLDivElement> {

    return this.generateColors(count).map((color: string) => {
      // create a div for each color
      const colourSample = document.createElement('div');

      //   // add a class to each div
      colourSample.classList.add('colourSample');

      //   // give each div a background color
      colourSample.style.background = color;
      colourSample.style.width = '100%';
      colourSample.style.height = '1.5em';

      return colourSample;
    });

    // console.debug('custom object:', this.customColourGradient);
  };



}
