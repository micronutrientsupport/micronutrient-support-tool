import { NgModule } from '@angular/core';
import { CastPipe } from './cast.pipe';
import { CurrencyExtendedPipe } from './currency-extended.pipe';
import { DataPropertyGetterPipe } from './dataPropertyGetter.pipe';
import { SignificantFiguresPipe } from './significantFigures.pipe';
import { filterAgeGroupPipe } from '../pages/quickMaps/components/sideNavContent/sideNavContent.component';
import { CapitalFirstPipe } from './capital-first.pipe';

@NgModule({
  declarations: [
    SignificantFiguresPipe,
    CastPipe,
    CurrencyExtendedPipe,
    CapitalFirstPipe,
    DataPropertyGetterPipe,
    filterAgeGroupPipe,
  ],
  imports: [],
  exports: [
    SignificantFiguresPipe,
    CastPipe,
    CurrencyExtendedPipe,
    CapitalFirstPipe,
    DataPropertyGetterPipe,
    filterAgeGroupPipe,
  ],
})
export class PipesModule {}
