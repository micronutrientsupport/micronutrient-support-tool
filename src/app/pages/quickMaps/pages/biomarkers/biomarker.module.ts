import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
import { RoutesModule } from 'src/app/routes/routes.module';
import { GridsterModule } from 'angular-gridster2';
import { ComponentsModule } from 'src/app/components/components.module';
import { DialogModule } from 'src/app/components/dialogs/dialog.module';
import { RouterModule } from '@angular/router';
import { BiomarkerComponent } from './biomarker.component';
import { BiomarkerDescriptionComponent } from './biomarkerDescription/biomarkerDescription.component';
import { BiomarkerStatusComponent } from './biomarkerStatus/biomarkerStatus.component';
import 'chartjs-chart-box-and-violin-plot';
import { BiomarkerOverviewComponent } from './biomarkerOverview/biomarkerOverview.component';


@NgModule({
  declarations: [
    BiomarkerComponent,
    BiomarkerDescriptionComponent,
    BiomarkerStatusComponent,
    BiomarkerOverviewComponent,
  ],
  imports: [
    CommonModule,
    LeafletModule,
    HttpClientModule,
    AppMaterialModule,
    ReactiveFormsModule,
    ChartjsModule,
    RoutesModule,
    GridsterModule,
    ComponentsModule,
    DialogModule,
    RouterModule,
  ]
})
export class BiomarkerModule { }
