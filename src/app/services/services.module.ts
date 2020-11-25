import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionaryService } from './dictionary.service';
import { HttpClientModule } from '@angular/common/http';
import { CurrentDataService } from './currentData.service';
import { SnackbarService } from './snackbar.service';
import { SharingService } from './sharing.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  exports: [],
  providers: [DictionaryService, CurrentDataService, SnackbarService, SharingService],
})
export class ServicesModule {}
