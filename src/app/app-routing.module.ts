import { NgModule } from '@angular/core';
import { Routes, RouterModule, Data } from '@angular/router';
import { NotFoundComponent } from './components/notFound/notFound.component';
import { HomeComponent } from './pages/home/home.component';
import { StyleGuideComponent } from './pages/styleGuide/styleGuide.component';
import { AppRoute, AppRoutes } from './routes/routes';
import { PathResolveService } from './services/pathResolve.service';
import { CostEffectivenessComponent } from './pages/costEffectiveness/costEffectiveness.component';
import { UserProfileComponent } from './pages/userProfile/userProfile.component';

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
    path: AppRoutes.HOME.getRouterPath(),
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
    path: AppRoutes.PROFILE.getRouterPath(),
    component: UserProfileComponent,
    data: {
      appRoute: AppRoutes.PROFILE,

      title: 'Profile',
      keywords: `tools, data,`,
      // eslint-disable-next-line max-len
      description: 'Tool for user to access and edit their profile details.',
    } as RouteData,
  },
  {
    path: AppRoutes.STYLE_GUIDE.getRouterPath(),
    component: StyleGuideComponent,
    data: {
      appRoute: AppRoutes.STYLE_GUIDE,
      title: 'Style Guide',
      keywords: 'Micronutrients, maps, policy, style guide',
      description: 'General website style guide',
    } as RouteData,
  },
  {
    path: AppRoutes.COST_EFFECTIVENESS.getRouterPath(),
    component: CostEffectivenessComponent,
    data: {
      appRoute: AppRoutes.COST_EFFECTIVENESS,
      title: 'Cost Effectivness',
      keywords: 'Micronutrients, maps, policy, style guide',
      description: '',
      showLightFooter: true,
    } as RouteData,
  },
  {
    path: AppRoutes.COST_EFFECTIVENESS.getRouterPath(),
    loadChildren: () =>
      import('src/app/pages/costEffectiveness/interventionReview/interventionReview.module').then(
        (m) => m.InterventionReviewModule,
      ),
  },
  {
    path: AppRoutes.QUICK_MAPS.getRouterPath(),
    loadChildren: () => import('./pages/quickMaps/quickMaps.module').then((m) => m.QuickMapsModule),
  },
  {
    path: '**',
    resolve: {
      path: PathResolveService,
    },
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
