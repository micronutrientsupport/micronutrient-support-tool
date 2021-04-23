/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import chroma from 'chroma-js';
import { ColourPaletteType } from './colourPaletteType.enum';

export const CUSTOM_PALETTE_NAME = 'Custom palette';
interface StoredPalette {
  name: ColourPaletteType;
  coloursArray: Array<string>;
};

export class ColourPalette {
  public static readonly PALETTES = [
    new ColourPalette(ColourPaletteType.BLUEREDYELLOWGREEN, ['#7a0177', '#feb24c', '#2ca25f']),
    new ColourPalette(ColourPaletteType.DIVERGINGCOLORS, ['#045E56', '#F6F2DC', '#A26157']),
    new ColourPalette(ColourPaletteType.COLOURBLIND,
      ['#332288', '#117733', '#44AA99', '#88CCEE', '#DDCC77', '#CC6677', '#AA4499', '#882255']),
  ];
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

  private static getPaletteKey(id: string, paletteType: string): string {
    return `${id}-${paletteType}-colour-palette`;
  }
  private static getPalette(id: string, paletteType: string): ColourPalette {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const retievedObject = JSON.parse(localStorage.getItem(this.getPaletteKey(id, paletteType))) as StoredPalette;
    return (null != retievedObject)
      ? new ColourPalette(retievedObject.name, retievedObject.coloursArray)
      : null;
  }
  private static setPalette(id: string, paletteType: string, palette: ColourPalette): void {
    const storeObject = {
      name: palette.name,
      coloursArray: palette.colourHexArray,
    } as StoredPalette;
    localStorage.setItem(this.getPaletteKey(id, paletteType), JSON.stringify(storeObject));
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
