import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material.module';

import { QuickMapsComponent } from './pages/quickMaps.component';
import { MapPageComponent } from './pages/components/mapPage/mapPage.component';
import { SideNavContentComponent } from './pages/components/sideNavContent/sideNavContent.component';

@NgModule({
  declarations: [QuickMapsComponent, MapPageComponent, SideNavContentComponent],
  imports: [CommonModule, LeafletModule, HttpClientModule, AppMaterialModule],
})
export class QuickMapsModule {}
