import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutes } from 'src/app/routes/routes';
import { CostEffectivenessComponent } from '../costEffectiveness/costEffectiveness.component';
import { RouteData } from 'src/app/app-routing.module';
import { FeatureFlagGuard } from 'src/app/guards/featureFlagGuard';

const routes: Routes = [
  {
    path: '',
    component: CostEffectivenessComponent,
    children: [ 
      // {
      //   path: AppRoutes.COST_EFFECTIVENESS.getRouterPath(),
      //   component: CostEffectivenessComponent,
      //   canActivate: [FeatureFlagGuard],
      //   canLoad: [FeatureFlagGuard],
      //   data: {
      //     featureFlag: 'CE-Enable',
      //     appRoute: AppRoutes.COST_EFFECTIVENESS,
      //     title: 'Explore cost effectiveness scenarios',
      //     keywords: '',
      //     description: '',
      //     showLightFooter: true,
      //   } as RouteData,
      // }
    ],
  },
  {
    path: AppRoutes.COST_EFFECTIVENESS.getRouterPath() + '**',
    loadChildren: () =>
      import('src/app/pages/costEffectiveness/interventionReview.module').then((m) => m.InterventionReviewModule),
  },
  // {
  //   path: '**',
  //   redirectTo: '',
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class costEffectivenessRoutingModule {}
