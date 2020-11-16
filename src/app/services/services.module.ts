import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionaryService } from './dictionary.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    DictionaryService,
  ]
})
export class ServicesModule { }
