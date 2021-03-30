import { ColourGradient } from './colourGradient';
import { ColourPallette } from './colourPallette';

const thresholdRange = [10, 20, 40, 60, 80, 99, 101];
const absoluteRange = [10, 50, 100, 250, 500, 1000, 1500, 2000];

export const pallettes = [
  new ColourPallette('Blue-Red-Yellow-Green', ['#7a0177', '#feb24c', '#2ca25f']),
  new ColourPallette('Red-Light-Green', ['#045E56', '#F6F2DC', '#A26157']),
  new ColourPallette('Colour Blind', ['#332288', '#117733', '#44AA99', '#88CCEE', '#DDCC77', '#CC6677', '#AA4499', '#882255']),
];

export const DEFAULT_THRESHOLD_COLOUR_GRADIENTS =
  pallettes.map(pallette => {
    const newPallette = new ColourPallette(pallette.name, pallette.colourHex.slice(0, thresholdRange.length));
    return new ColourGradient(thresholdRange, newPallette);
  });


export const DEFAULT_ABSOLUTE_COLOUR_GRADIENTS =
  pallettes.map(pallette => {
    const newPallette = new ColourPallette(pallette.name, pallette.colourHex.slice(0, absoluteRange.length));
    return new ColourGradient(absoluteRange, newPallette);
  });

