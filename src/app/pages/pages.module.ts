import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppMaterialModule } from '../app-material.module';
import { EducationalResourcesComponent } from './educationalResources/educationalResources.component';
import { HelpComponent } from './help/help.component';
import { HomeComponent } from './home/home.component';
import { MapsToolComponent } from './mapsTool/mapsTool.component';
import { ProjectObjectivesComponent } from './projectObjectives/projectObjectives.component';
import { QuickMapsComponent } from './quickMaps/quickMaps.component';

@NgModule({
  declarations: [
    HomeComponent,
    MapsToolComponent,
    QuickMapsComponent,
    EducationalResourcesComponent,
    HelpComponent,
    ProjectObjectivesComponent,
  ],
  imports: [CommonModule, RouterModule, AppMaterialModule, LeafletModule, HttpClientModule],
  providers: [],
  exports: [
    HomeComponent,
    MapsToolComponent,
    QuickMapsComponent,
    EducationalResourcesComponent,
    HelpComponent,
    ProjectObjectivesComponent,
  ],
})
export class PagesModule {}
