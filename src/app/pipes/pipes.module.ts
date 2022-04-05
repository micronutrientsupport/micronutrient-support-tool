import { NgModule } from '@angular/core';
import { CastPipe } from './cast.pipe';
import { CurrencyExtendedPipe } from './currency-extended.pipe';
import { SignificantFiguresPipe } from './significantFigures.pipe';

@NgModule({
  declarations: [SignificantFiguresPipe, CastPipe, CurrencyExtendedPipe],
  imports: [],
  exports: [SignificantFiguresPipe, CastPipe, CurrencyExtendedPipe],
})
export class PipesModule {}
