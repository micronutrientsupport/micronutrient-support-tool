import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from 'src/app/app-material.module';
import { DialogModule } from 'src/app/components/dialogs/dialog.module';
import { RouterModule } from '@angular/router';
import { RoutesModule } from 'src/app/routes/routes.module';
import { InterventionSideNavContentComponent } from './interventionSideNavContent/interventionSideNavContent.component';
@NgModule({
  declarations: [InterventionSideNavContentComponent],
  imports: [CommonModule, DialogModule, RouterModule, RoutesModule, AppMaterialModule],
  exports: [InterventionSideNavContentComponent],
})
export class InterventionReviewComponentsModule {}
