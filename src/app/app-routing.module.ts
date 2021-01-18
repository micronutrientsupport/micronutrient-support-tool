import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EducationalResourcesComponent } from './pages/educationalResources/educationalResources.component';
import { HelpComponent } from './pages/help/help.component';
import { HomeComponent } from './pages/home/home.component';
import { MapsToolComponent } from './pages/mapsTool/mapsTool.component';
import { ProjectObjectivesComponent } from './pages/projectObjectives/projectObjectives.component';
import { StyleGuideComponent } from './pages/styleGuide/styleGuide.component';
import { AppRoutes } from './routes/routes';

export interface FooterRouteData {
  showFullFooter: boolean;
}

const routes: Routes = [
  {
    path: AppRoutes.HOME.segments,
    component: HomeComponent,
    data: { FooterRouteData: true },
  },
  {
    path: AppRoutes.MAPS_TOOL.segments,
    component: MapsToolComponent,
    data: { FooterRouteData: true },
  },
  {
    path: AppRoutes.EDUCATIONAL_RESOURCES.segments,
    component: EducationalResourcesComponent,
    data: { FooterRouteData: true },
  },
  {
    path: AppRoutes.HELP.segments,
    component: HelpComponent,
    data: { FooterRouteData: true },
  },
  {
    path: AppRoutes.PROJECT_OBJECTIVES.segments,
    component: ProjectObjectivesComponent,
    data: { FooterRouteData: true },
  },
  {
    path: AppRoutes.STYLE_GUIDE.segments,
    component: StyleGuideComponent,
    data: { FooterRouteData: true },
  },
  {
    path: AppRoutes.QUICK_MAPS.segments,
    data: { FooterRouteData: false },
    loadChildren: () => import('./pages/quickMaps/quickMaps.module').then((m) => m.QuickMapsModule),
  },
  {
    path: '**',
    redirectTo: '',
    data: { FooterRouteData: false },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
