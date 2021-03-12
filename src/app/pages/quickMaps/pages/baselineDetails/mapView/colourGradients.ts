import { ColourGradient } from './colourGradient';
import { ColourGradientType } from './colourGradientType.enum';

const thresholdRange = [10, 20, 40, 60, 80, 99, 101];
const absoluteRange = [0, 10, 50, 100, 250, 500, 1000, 1500];

export const DEFAULT_THRESHOLD_COLOUR_GRADIENTS = [
  new ColourGradient(ColourGradientType.BLUEREDYELLOWGREEN, 'Blue-Red-Yellow-Green', thresholdRange, [
    '#7a0177',
    '#bd0026',
    '#f03b20',
    '#feb24c',
    '#ffeda0',
    '#addd8e',
    '#2ca25f',
  ]),
  new ColourGradient(ColourGradientType.DIVERGINGCOLORS, 'Red-Light-Green', thresholdRange, [
    '#045E56',
    '#237E64',
    '#8ADABB',
    '#F6F2DC',
    '#E7B8B0',
    '#CF8174',
    '#A26157',
  ]),
  new ColourGradient(ColourGradientType.COLOURBLIND, 'Colour Blind', thresholdRange, [
    '#332288',
    '#117733',
    '#44AA99',
    '#88CCEE',
    '#DDCC77',
    '#CC6677',
    '#AA4499',
  ]),
];

export const DEFAULT_ABSOLUTE_COLOUR_GRADIENTS = [
  new ColourGradient(ColourGradientType.BLUEREDYELLOWGREEN, 'Blue-Red-Yellow-Green', absoluteRange, [
    '#354969',
    '#7a0177',
    '#bd0026',
    '#f03b20',
    '#feb24c',
    '#ffeda0',
    '#addd8e',
    '#2ca25f',
  ]),
  new ColourGradient(ColourGradientType.DIVERGINGCOLORS, 'Red-Light-Green', absoluteRange, [
    '#045E56',
    '#237E64',
    '#8ADABB',
    '#F6F2DC',
    '#E7B8B0',
    '#CF8174',
    '#A26157',
    '#762418',
  ]),
  new ColourGradient(ColourGradientType.COLOURBLIND, 'Colour Blind', absoluteRange, [
    '#332288',
    '#117733',
    '#44AA99',
    '#88CCEE',
    '#DDCC77',
    '#CC6677',
    '#AA4499',
    '#882255',
  ]),
];
