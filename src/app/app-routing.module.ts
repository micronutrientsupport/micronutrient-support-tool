import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EducationalResourcesComponent } from './pages/educationalResources/educationalResources.component';
import { HelpComponent } from './pages/help/help.component';
import { HomeComponent } from './pages/home/home.component';
import { MapsToolComponent } from './pages/mapsTool/mapsTool.component';
import { ProjectObjectivesComponent } from './pages/projectObjectives/projectObjectives.component';
import { QuickMapsComponent } from './pages/quickMaps/pages/quickMaps.component';
import { StyleGuideComponent } from './pages/styleGuide/styleGuide.component';
import { AppRoutes } from './routes/routes';

const routes: Routes = [
  {
    path: AppRoutes.HOME.segments,
    component: HomeComponent,
  },
  {
    path: AppRoutes.MAPS_TOOL.segments,
    component: MapsToolComponent,
  },
  {
    path: AppRoutes.EDUCATIONAL_RESOURCES.segments,
    component: EducationalResourcesComponent,
  },
  {
    path: AppRoutes.HELP.segments,
    component: HelpComponent,
  },
  {
    path: AppRoutes.PROJECT_OBJECTIVES.segments,
    component: ProjectObjectivesComponent,
  },
  {
    path: AppRoutes.STYLE_GUIDE.segments,
    component: StyleGuideComponent,
  },
  {
    path: AppRoutes.QUICK_MAPS.segments,
    component: QuickMapsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
