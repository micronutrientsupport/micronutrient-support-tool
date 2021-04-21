import { ColourGradient } from './colourGradient';
import { ColourPaletteType } from './colourPaletteType.enum';
export interface CustomColourObject {
  type: ColourPaletteType;
  customColourGradient?: ColourGradient;
}
