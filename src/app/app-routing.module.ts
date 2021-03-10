import { NgModule } from '@angular/core';
import { Routes, RouterModule, Data } from '@angular/router';
import { EducationalResourcesComponent } from './pages/educationalResources/educationalResources.component';
import { HelpComponent } from './pages/help/help.component';
import { HomeComponent } from './pages/home/home.component';
import { MapsToolComponent } from './pages/mapsTool/mapsTool.component';
import { ProjectObjectivesComponent } from './pages/projectObjectives/projectObjectives.component';
import { StyleGuideComponent } from './pages/styleGuide/styleGuide.component';
import { AppRoute, AppRoutes } from './routes/routes';

export interface RouteData extends Data {
  appRoute: AppRoute;
  title: string;
  description: string;
  keywords: string;
  hideQuickMapsHeader?: boolean;
  showQuickMapsGoButton?: boolean;
  showLightFooter?: boolean;
}

const routes: Routes = [
  {
    path: AppRoutes.HOME.segments,
    component: HomeComponent,
    data: {
      appRoute: AppRoutes.HOME,
      title: 'Homepage',
      keywords: 'Micronutrients, maps, policy',
      // eslint-disable-next-line max-len
      description: `MAPS is a web-hosted tool, communicating estimates of dietary micronutrient (MN) supplies and deficiency risks at national and sub-national scales in Africa.
      The tool draws on MN biomarker survey data where these are available,
      and dietary MN supply estimates derived from nationa-scale (Food Balance Sheets)
      or sub-national (House-hold Consumption and Expenditure Survey) data,
      presenting the user with multiple perspectives on MN deficiency risks and highlighting where there are major data gaps.`,
    } as RouteData,
  },
  {
    path: AppRoutes.MAPS_TOOL.segments,
    component: MapsToolComponent,
    data: {
      appRoute: AppRoutes.MAPS_TOOL,
      title: 'Tools',
      keywords: `Micronutrients, maps, tools, data, interventions, projections,
      deficiency risks, food fortification, food system changes, national, sub-national`,
      // eslint-disable-next-line max-len
      description: 'Various tools to explore micronutrient deficiencies in your geography of interest and possible interventions to mitigate the micro-nutrient deficiencies.',
    } as RouteData,
  },
  {
    path: AppRoutes.EDUCATIONAL_RESOURCES.segments,
    component: EducationalResourcesComponent,
    data: {
      appRoute: AppRoutes.EDUCATIONAL_RESOURCES,
      title: 'Educational Resources',
      keywords: 'Micronutrients, maps, policy, education resources',
      description: 'Various education resources to exapnd knowledge related to this topic.',
    } as RouteData,
  },
  {
    path: AppRoutes.HELP.segments,
    component: HelpComponent,
    data: {
      appRoute: AppRoutes.HELP,
      title: 'Help',
      keywords: 'Micronutrients, maps, policy, help',
      description: 'Some more information on what Micronutrient Action Policy Support (MAPS) does and what it has to offer.',
    } as RouteData,
  },
  {
    path: AppRoutes.PROJECT_OBJECTIVES.segments,
    component: ProjectObjectivesComponent,
    data: {
      appRoute: AppRoutes.PROJECT_OBJECTIVES,
      title: 'Project Objectives',
      keywords: 'Micronutrients, maps, policy, project objectives',
      description: 'Some more information on what Micronutrient Action Policy Support (MAPS) does and what it aims to achieve.',
    } as RouteData,
  },
  {
    path: AppRoutes.STYLE_GUIDE.segments,
    component: StyleGuideComponent,
    data: {
      appRoute: AppRoutes.STYLE_GUIDE,
      title: 'Style Guide',
      keywords: 'Micronutrients, maps, policy, style guide',
      description: 'General website style guide',
    } as RouteData,
  },
  {
    path: AppRoutes.QUICK_MAPS.segments,
    loadChildren: () => import('./pages/quickMaps/quickMaps.module').then((m) => m.QuickMapsModule),
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
