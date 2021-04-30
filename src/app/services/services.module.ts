import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionaryService } from './dictionary.service';
import { HttpClientModule } from '@angular/common/http';
import { CurrentDataService } from './currentData.service';
import { SnackbarService } from './snackbar.service';
import { SharingService } from './sharing.service';
import { MiscApiService } from './miscApi.service';
import { PageLoadingService } from './pageLoadingService.service';
import { QuickchartService } from './quickChart.service';
import { GridsterService } from './gridster.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  exports: [],
  providers: [
    DictionaryService,
    CurrentDataService,
    MiscApiService,
    SnackbarService,
    SharingService,
    PageLoadingService,
    QuickchartService,
    GridsterService,
  ],
})
export class ServicesModule {}
