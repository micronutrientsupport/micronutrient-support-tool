import { NgModule } from '@angular/core';
import { CastPipe } from './cast.pipe';
import { CurrencyExtendedPipe } from './currency-extended.pipe';
import { DataPropertyGetterPipe } from './dataPropertyGetter.pipe';
import { SignificantFiguresPipe } from './significantFigures.pipe';

@NgModule({
  declarations: [SignificantFiguresPipe, CastPipe, CurrencyExtendedPipe, DataPropertyGetterPipe],
  imports: [],
  exports: [SignificantFiguresPipe, CastPipe, CurrencyExtendedPipe, DataPropertyGetterPipe],
})
export class PipesModule {}
