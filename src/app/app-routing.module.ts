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
  hideQuickMapsHeader?: boolean;
  showLightFooter?: boolean;
}

const routes: Routes = [
  {
    path: AppRoutes.HOME.segments,
    component: HomeComponent,
    data: { title: 'Home' }
  },
  {
    path: AppRoutes.MAPS_TOOL.segments,
    component: MapsToolComponent,
    data: { title: 'Maps Tools' }
  },
  {
    path: AppRoutes.EDUCATIONAL_RESOURCES.segments,
    component: EducationalResourcesComponent,
    data: { title: 'Educational Resources' }
  },
  {
    path: AppRoutes.HELP.segments,
    component: HelpComponent,
    data: { title: 'Help' }
  },
  {
    path: AppRoutes.PROJECT_OBJECTIVES.segments,
    component: ProjectObjectivesComponent,
    data: { title: 'Project Objectives' }
  },
  {
    path: AppRoutes.STYLE_GUIDE.segments,
    component: StyleGuideComponent,
    data: { title: 'Style Guide' }
  },
  {
    path: AppRoutes.QUICK_MAPS.segments,
    loadChildren: () => import('./pages/quickMaps/quickMaps.module').then((m) => m.QuickMapsModule),
    data: { showLightFooter: true, title: 'Quick Maps' },
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
export class AppRoutingModule { }
