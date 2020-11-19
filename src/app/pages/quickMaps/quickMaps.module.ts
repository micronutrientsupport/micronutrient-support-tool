import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material.module';
import { QuickMapsComponent } from './quickMaps.component';
import { MapPageComponent } from './components/mapPage/mapPage.component';
import { SideNavContentComponent } from './components/sideNavContent/sideNavContent.component';
import { BaselineDetailsComponent } from './components/baselineDetails/baselineDetails.component';
import { ChartjsModule } from '@ctrl/ngx-chartjs';

@NgModule({
  declarations: [QuickMapsComponent, MapPageComponent, SideNavContentComponent, BaselineDetailsComponent],
  imports: [CommonModule, LeafletModule, HttpClientModule, AppMaterialModule, ChartjsModule],
})
export class QuickMapsModule {}
