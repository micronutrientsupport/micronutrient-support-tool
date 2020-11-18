import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionaryService } from './dictionary.service';
import { HttpClientModule } from '@angular/common/http';
import { CurrentDataService } from './currentData.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  exports: [],
  providers: [DictionaryService, CurrentDataService],
})
export class ServicesModule {}
