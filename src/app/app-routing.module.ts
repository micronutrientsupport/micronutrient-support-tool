import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { data } from 'cypress/types/jquery';
import { EducationalResourcesComponent } from './pages/educationalResources/educationalResources.component';
import { HelpComponent } from './pages/help/help.component';
import { HomeComponent } from './pages/home/home.component';
import { MapsToolComponent } from './pages/mapsTool/mapsTool.component';
import { ProjectObjectivesComponent } from './pages/projectObjectives/projectObjectives.component';
import { QuickMapsModule } from './pages/quickMaps/quickMaps.module';
import { QuickMapsService } from './pages/quickMaps/quickMaps.service';
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
    data: { title: 'Micronutrient Action Policy Support (MAPS): Homepage' }
  },
  {
    path: AppRoutes.MAPS_TOOL.segments,
    component: MapsToolComponent,
    data: { title: 'Micronutrient Action Policy Support (MAPS): Tools' }
  },
  {
    path: AppRoutes.EDUCATIONAL_RESOURCES.segments,
    component: EducationalResourcesComponent,
    data: { title: 'Micronutrient Action Policy Support (MAPS): Educational Resources' }
  },
  {
    path: AppRoutes.HELP.segments,
    component: HelpComponent,
    data: { title: 'Micronutrient Action Policy Support (MAPS): Help' }
  },
  {
    path: AppRoutes.PROJECT_OBJECTIVES.segments,
    component: ProjectObjectivesComponent,
    data: { title: 'Micronutrient Action Policy Support (MAPS): Project Objectives' }
  },
  {
    path: AppRoutes.STYLE_GUIDE.segments,
    component: StyleGuideComponent,
    data: { title: 'Micronutrient Action Policy Support (MAPS): Style Guide' }
  },
  {
    path: AppRoutes.QUICK_MAPS.segments,
    loadChildren: () => import('./pages/quickMaps/quickMaps.module').then((m) => m.QuickMapsModule),
    data: { showLightFooter: true, title: 'Micronutrient Action Policy Support (MAPS): Quick Maps' },
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
