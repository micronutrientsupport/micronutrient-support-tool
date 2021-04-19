import { ColourGradient } from './colourGradient';
import { ColourGradientType } from './colourGradientType.enum';
import { ColourPalette } from './colourPalette';

const thresholdRange = [10, 20, 40, 60, 80, 99, 101];
const absoluteRange = [10, 50, 100, 250, 500, 1000, 1500, 2000];

export const PALETTES = [
  new ColourPalette(ColourGradientType.BLUEREDYELLOWGREEN, ['#7a0177', '#feb24c', '#2ca25f']),
  new ColourPalette(ColourGradientType.DIVERGINGCOLORS, ['#045E56', '#F6F2DC', '#A26157']),
  new ColourPalette(ColourGradientType.COLOURBLIND,
    ['#332288', '#117733', '#44AA99', '#88CCEE', '#DDCC77', '#CC6677', '#AA4499', '#882255']),
];

export const DEFAULT_THRESHOLD_COLOUR_GRADIENTS =
  PALETTES.map(palette => {
    const newPallette = new ColourPalette(palette.name, palette.colourHex.slice(0, thresholdRange.length));
    return new ColourGradient(thresholdRange, newPallette);
  });


export const DEFAULT_ABSOLUTE_COLOUR_GRADIENTS =
  PALETTES.map(palette => {
    const newPallette = new ColourPalette(palette.name, palette.colourHex.slice(0, absoluteRange.length));
    return new ColourGradient(absoluteRange, newPallette);
  });

