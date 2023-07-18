import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutes } from 'src/app/routes/routes';
import { CostEffectivenessComponent } from '../costEffectiveness/costEffectiveness.component';

const routes: Routes = [
  {
    path: '',
    component: CostEffectivenessComponent,
    children: [],
  },
  {
    path: AppRoutes.COST_EFFECTIVENESS.getRouterPath() + '**',
    loadChildren: () =>
      import('src/app/pages/costEffectiveness/interventionReview/interventionReview.module').then(
        (m) => m.InterventionReviewModule,
      ),
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
export class CostEffectivenessRoutingModule {}
