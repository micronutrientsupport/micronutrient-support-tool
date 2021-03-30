/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import chroma from 'chroma-js';

export const readonly CUSTOM_PALLETTE_NAME = 'Custom Pallette';
export class ColourPallette {
  constructor(
    public readonly name: string,
    public readonly colourHex: Array<string>,
  ) {

  }


  public generateColors(count: number): Array<string> {
    // get array of colors from chroma.js

    return chroma
      .scale(this.colourHex)
      .colors(count) as Array<string>;

  };

  public generateColorsForDisplay(count = 8): Array<HTMLElement> {

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
