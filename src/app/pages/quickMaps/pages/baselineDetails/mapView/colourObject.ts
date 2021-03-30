import { ColourGradient } from './colourGradient';
import { ColourGradientType } from './colourGradientType.enum';
export interface CustomColourObject {
  type: ColourGradientType;
  customColourGradient?: ColourGradient;
}
