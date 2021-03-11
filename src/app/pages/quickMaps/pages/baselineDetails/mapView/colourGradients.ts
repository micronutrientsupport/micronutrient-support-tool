import { ColourGradient } from './colourGradient';

const thresholdRange = [10, 20, 40, 60, 80, 99, 101];


export const DEFAULT_THRESHOLD_COLOUR_GRADIENTS = [
  new ColourGradient(
    'blueRedYellowGreen',
    'Blue-Red-Yellow-Green',
    thresholdRange,
    ['#7a0177', '#bd0026', '#f03b20', '#feb24c', '#ffeda0', '#addd8e', '#2ca25f'],
  ),
  new ColourGradient(
    'blRellowGreen',
    'Red-Yellow-Green',
    thresholdRange,
    ['#7a0177', '#bd0026', '#f03b20', '#feb24c', '#ffeda0', '#addd8e', '#2ca25f'].reverse(),
  ),
];
