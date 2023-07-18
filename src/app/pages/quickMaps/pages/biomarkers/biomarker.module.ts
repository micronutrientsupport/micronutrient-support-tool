import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RoutesModule } from 'src/app/routes/routes.module';
import { GridsterModule } from 'angular-gridster2';
import { ComponentsModule } from 'src/app/components/components.module';
import { DialogModule } from 'src/app/components/dialogs/dialog.module';
import { RouterModule } from '@angular/router';
import { BiomarkerComponent } from './biomarker.component';
import { BiomarkerDescriptionComponent } from './biomarkerDescription/biomarkerDescription.component';
import { BiomarkerStatusComponent } from './biomarkerStatus/biomarkerStatus.component';
import 'chartjs-chart-box-and-violin-plot';
import { BiomarkerInfoComponent } from './biomarkerInfo/biomarkerInfo.component';
import { BiomarkerOverviewComponent } from './biomarkerOverview/biomarkerOverview.component';
import { StatusMapsComponent } from './biomarkerStatus/statusMaps/statusMaps.component';
import { StatusTableComponent } from './biomarkerStatus/statusTable/statusTable.component';
import { StatusChartComponent } from './biomarkerStatus/statusChart/statusChart.component';
import { StatusDownloadComponent } from './biomarkerStatus/statusDownload/statusDownload.component';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    BiomarkerComponent,
    BiomarkerDescriptionComponent,
    BiomarkerStatusComponent,
    BiomarkerInfoComponent,
    BiomarkerOverviewComponent,
    StatusMapsComponent,
    StatusTableComponent,
    StatusChartComponent,
    StatusDownloadComponent,
  ],
  imports: [
    CommonModule,
    LeafletModule,
    HttpClientModule,
    AppMaterialModule,
    ReactiveFormsModule,
    RoutesModule,
    GridsterModule,
    ComponentsModule,
    DialogModule,
    RouterModule,
    ClipboardModule,
  ],
  providers: [],
})
export class BiomarkerModule {}
