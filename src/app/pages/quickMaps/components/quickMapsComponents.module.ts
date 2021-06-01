import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/app-material.module';
import { SideNavContentComponent } from './sideNavContent/sideNavContent.component';
import { QuickMapsService } from '../quickMaps.service';
import { QuickMapsHeaderComponent } from './quickMapsHeader.component/quickMapsHeader.component';
import { RoutesModule } from 'src/app/routes/routes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EstimateComponent } from './estimate/estimate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';
@NgModule({
  declarations: [SideNavContentComponent, QuickMapsHeaderComponent, EstimateComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RoutesModule,
    MatProgressSpinnerModule,
    RouterModule,
    PipesModule,
  ],
  providers: [QuickMapsService],
  exports: [SideNavContentComponent, QuickMapsHeaderComponent, EstimateComponent],
})
export class QuickMapsComponentsModule {}
