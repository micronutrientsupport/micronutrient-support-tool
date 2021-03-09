import { ColourGradientType } from './colourGradientType.enum';
import { CustomGradientObject } from './customGradientObject';

export interface CustomColourObject {
  type: ColourGradientType;
  customObject?: CustomGradientObject;
}
