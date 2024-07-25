import { NgModule } from '@angular/core';
import { CastPipe } from './cast.pipe';
import { CurrencyExtendedPipe } from './currency-extended.pipe';
import { DataPropertyGetterPipe } from './dataPropertyGetter.pipe';
import { SignificantFiguresPipe } from './significantFigures.pipe';
import { filterAgeGroupPipe } from '../pages/quickMaps/components/sideNavContent/sideNavContent.component';

@NgModule({
  declarations: [SignificantFiguresPipe, CastPipe, CurrencyExtendedPipe, DataPropertyGetterPipe, filterAgeGroupPipe],
  imports: [],
  exports: [SignificantFiguresPipe, CastPipe, CurrencyExtendedPipe, DataPropertyGetterPipe, filterAgeGroupPipe],
})
export class PipesModule {}
