import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EducationalResourcesComponent } from './pages/educationalResources/educationalResources.component';
import { HelpComponent } from './pages/help/help.component';
import { HomeComponent } from './pages/home/home.component';
import { MapsToolComponent } from './pages/mapsTool/mapsTool.component';
import { ProjectObjectivesComponent } from './pages/projectObjectives/projectObjectives.component';
import { StyleGuideComponent } from './pages/styleGuide/styleGuide.component';
import { AppRoutes } from './routes/routes';

export interface RouteData {
  showQuickMapsHeader?: boolean;
  showFullFooter?: boolean;
}

const routes: Routes = [
  {
    path: AppRoutes.HOME.segments,
    component: HomeComponent,
    data: { showFullFooter: true },
  },
  {
    path: AppRoutes.MAPS_TOOL.segments,
    component: MapsToolComponent,
    data: { showFullFooter: true },
  },
  {
    path: AppRoutes.EDUCATIONAL_RESOURCES.segments,
    component: EducationalResourcesComponent,
    data: { showFullFooter: true },
  },
  {
    path: AppRoutes.HELP.segments,
    component: HelpComponent,
    data: { showFullFooter: true },
  },
  {
    path: AppRoutes.PROJECT_OBJECTIVES.segments,
    component: ProjectObjectivesComponent,
    data: { showFullFooter: true },
  },
  {
    path: AppRoutes.STYLE_GUIDE.segments,
    component: StyleGuideComponent,
    data: { showFullFooter: true },
  },
  {
    path: AppRoutes.QUICK_MAPS.segments,
    loadChildren: () => import('./pages/quickMaps/quickMaps.module').then((m) => m.QuickMapsModule),
    data: { showFullFooter: false },
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
