import { NgModule } from '@angular/core';
import { CastPipe } from './cast.pipe';
import { SignificantFiguresPipe } from './significantFigures.pipe';

@NgModule({
  declarations: [SignificantFiguresPipe, CastPipe],
  imports: [],
  exports: [SignificantFiguresPipe, CastPipe],
})
export class PipesModule {}
