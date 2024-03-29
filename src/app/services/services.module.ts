import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionaryService } from './dictionary.service';
import { HttpClientModule } from '@angular/common/http';
import { SnackbarService } from './snackbar.service';
import { SharingService } from './sharing.service';
import { PageLoadingService } from './pageLoadingService.service';
import { GridsterService } from './gridster.service';
import { ScenarioDataService } from './scenarioData.service';
import { ProjectionDataService } from './projectionData.service';
import { DietDataService } from './dietData.service';
import { JSONLogicService } from './jsonlogic.service';
import { QrCodeService } from './qrCode.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  exports: [],
  providers: [
    DictionaryService,
    DietDataService,
    ProjectionDataService,
    SnackbarService,
    SharingService,
    PageLoadingService,
    GridsterService,
    ScenarioDataService,
    JSONLogicService,
    QrCodeService,
  ],
})
export class ServicesModule {}
