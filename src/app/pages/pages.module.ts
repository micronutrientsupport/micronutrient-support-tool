import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppMaterialModule } from '../app-material.module';
import { RoutesModule } from '../routes/routes.module';
import { EducationalResourcesComponent } from './educationalResources/educationalResources.component';
import { HelpComponent } from './help/help.component';
import { HomeComponent } from './home/home.component';
import { MapsToolComponent } from './mapsTool/mapsTool.component';
import { ProjectObjectivesComponent } from './projectObjectives/projectObjectives.component';
import { QuickMapsModule } from './quickMaps/quickMaps.module';
import { StyleGuideComponent } from './styleGuide/styleGuide.component';
import { StorymapComponent } from './help/storymap/storymap.component';

@NgModule({
  declarations: [
    HomeComponent,
    MapsToolComponent,
    EducationalResourcesComponent,
    HelpComponent,
    ProjectObjectivesComponent,
    StyleGuideComponent,
    StorymapComponent,
  ],
  imports: [CommonModule, RouterModule, AppMaterialModule, QuickMapsModule, RoutesModule],
  providers: [],
  exports: [],
})
export class PagesModule {}
