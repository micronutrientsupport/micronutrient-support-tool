import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppMaterialModule } from '../app-material.module';
import { HomeComponent } from './home/home.component';
import { MapsToolComponent } from './mapsTool/mapsTool.component';
import { QuickMapsComponent } from './quickMaps/quickMaps.component';

@NgModule({
  declarations: [HomeComponent, MapsToolComponent, QuickMapsComponent],
  imports: [CommonModule, RouterModule, AppMaterialModule],
  providers: [],
  exports: [HomeComponent, MapsToolComponent, QuickMapsComponent],
})
export class PagesModule {}
