import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionaryService } from './dictionary.service';
import { HttpClientModule } from '@angular/common/http';
import { CurrentDataService } from './currentData.service';
import { SnackbarService } from './snackbar.service';
import { SharingService } from './sharing.service';
import { PageLoadingService } from './pageLoadingService.service';
import { QuickchartService } from './quickChart.service';
import { GridsterService } from './gridster.service';
import { ScenarioDataService } from './scenarioData.service';
import { ProjectionDataService } from './projectionData.service';
import { BiomarkerDataService } from './biomarkerData.service';
import { DietDataService } from './dietData.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  exports: [],
  providers: [
    DictionaryService,
    CurrentDataService,
    DietDataService,
    BiomarkerDataService,
    ProjectionDataService,
    SnackbarService,
    SharingService,
    PageLoadingService,
    QuickchartService,
    GridsterService,
    ScenarioDataService,
  ],
})
export class ServicesModule {}
