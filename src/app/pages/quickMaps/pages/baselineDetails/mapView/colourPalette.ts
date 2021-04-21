/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import chroma from 'chroma-js';
import { ColourPaletteType } from './colourPaletteType.enum';

export const CUSTOM_PALETTE_NAME = 'Custom palette';
export class ColourPalette {
  private static readonly SELECTED_PALETTE_KEY = 'selected';
  private static readonly CUSTOM_PALETTE_KEY = 'custom';
  constructor(
    public readonly name: ColourPaletteType,
    public readonly colourHexArray: Array<string>,
  ) { }

  public static getSelectedPalette(id: string): ColourPalette {
    return ColourPalette.getPalette(id, ColourPalette.SELECTED_PALETTE_KEY);
  }
  public static getCustomPalette(id: string): ColourPalette {
    return ColourPalette.getPalette(id, ColourPalette.CUSTOM_PALETTE_KEY);
  }
  public static setSelectedPalette(id: string, palette: ColourPalette): void {
    return ColourPalette.setPalette(id, ColourPalette.SELECTED_PALETTE_KEY, palette);
  }
  public static setCustomPalette(id: string, palette: ColourPalette): void {
    return ColourPalette.setPalette(id, ColourPalette.CUSTOM_PALETTE_KEY, palette);
  }

  private static getPaletteKey(id: string, palletteType: string): string {
    return `${id}-${palletteType}-colour-palette`;
  }
  private static getPalette(id: string, palletteType: string): ColourPalette {
    const retievedPalette = JSON.parse(localStorage.getItem(this.getPaletteKey(id, palletteType))) as ColourPalette; // not really
    return (null != retievedPalette)
      ? new ColourPalette(retievedPalette.name, retievedPalette.colourHexArray)
      : null;
  }
  private static setPalette(id: string, palletteType: string, palette: ColourPalette): void {
    localStorage.setItem(this.getPaletteKey(id, palletteType), JSON.stringify(palette));
  }



  public generateColors(count: number): Array<string> {
    // get array of colors from chroma.js
    return chroma
      .scale(this.colourHexArray)
      .colors(count) as Array<string>;
  }

  /**
   * called for display of gradient in dialog
   */
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
  }
}
