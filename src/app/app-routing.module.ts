import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutes } from './app-routes';
import { EducationalResourcesComponent } from './pages/educationalResources/educationalResources.component';
import { HelpComponent } from './pages/help/help.component';
import { HomeComponent } from './pages/home/home.component';
import { MapsToolComponent } from './pages/mapsTool/mapsTool.component';
import { ProjectObjectivesComponent } from './pages/projectObjectives/projectObjectives.component';
import { QuickMapsComponent } from './pages/quickMaps/quickMaps.component';

const routes: Routes = [
  {
    path: AppRoutes.HOME.key,
    component: HomeComponent,
  },
  {
    path: AppRoutes.MAPS_TOOL.key,
    component: MapsToolComponent,
  },
  {
    path: AppRoutes.QUICK_MAPS.key,
    component: QuickMapsComponent,
  },
  {
    path: AppRoutes.EDUCATIONAL_RESOURCES.key,
    component: EducationalResourcesComponent,
  },
  {
    path: AppRoutes.HELP.key,
    component: HelpComponent,
  },
  {
    path: AppRoutes.PROJECT_OBJECTIVES.key,
    component: ProjectObjectivesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
