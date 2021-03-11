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
      title: 'Homepage',
      keywords: 'Micronutrients, maps, policy',
      // eslint-disable-next-line max-len
      description: `MAPS is a web-hosted tool, communicating estimates of dietary micronutrient (MN) supplies and deficiency risks at national and sub-national scales in Africa.
      The tool draws on MN biomarker survey data where these are available,
      and dietary MN supply estimates derived from nationa-scale (Food Balance Sheets)
      or sub-national (House-hold Consumption and Expenditure Survey) data,
      presenting the user with multiple perspectives on MN deficiency risks and highlighting where there are major data gaps.`,
    }
  },
  {
    path: AppRoutes.MAPS_TOOL.segments,
    component: MapsToolComponent,
    data: {
      title: 'Tools',
      keywords: `Micronutrients, maps, tools, data, interventions, projections,
      deficiency risks, food fortification, food system changes, national, sub-national`,
      // eslint-disable-next-line max-len
      description: 'Various tools to explore micronutrient deficiencies in your geography of interest and possible interventions to mitigate the micro-nutrient deficiencies.',
    }
  },
  {
    path: AppRoutes.EDUCATIONAL_RESOURCES.segments,
    component: EducationalResourcesComponent,
    data: {
      title: 'Educational Resources',
      keywords: 'Micronutrients, maps, policy, education resources',
      description: 'Various education resources to exapnd knowledge related to this topic.',
    }
  },
  {
    path: AppRoutes.HELP.segments,
    component: HelpComponent,
    data: {
      title: 'Help',
      keywords: 'Micronutrients, maps, policy, help',
      description: 'Some more information on what Micronutrient Action Policy Support (MAPS) does and what it has to offer.',
    }
  },
  {
    path: AppRoutes.PROJECT_OBJECTIVES.segments,
    component: ProjectObjectivesComponent,
    data: {
      title: 'Project Objectives',
      keywords: 'Micronutrients, maps, policy, project objectives',
      description: 'Some more information on what Micronutrient Action Policy Support (MAPS) does and what it aims to achieve.',
    }
  },
  {
    path: AppRoutes.STYLE_GUIDE.segments,
    component: StyleGuideComponent,
    data: {
      title: 'Style Guide',
      keywords: 'Micronutrients, maps, policy, style guide',
      description: 'General website style guide',
    }
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
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {

  constructor() { }
}
