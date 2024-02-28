import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppMaterialModule } from '../app-material.module';
import { RoutesModule } from '../routes/routes.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FooterLightComponent } from './footerLight/footerLight.component';
import { LoadingComponent } from './loading/loading.component';
import { CardComponent } from './card/card.component';
import { NotificationModule } from './notifications/notification.module';
import { NotFoundComponent } from './notFound/notFound.component';
import { DownloadComponent } from '../pages/quickMaps/components/download/download.component';
import { DirectivesModule } from '../directives/directives.module';
import { NoResultsComponent } from './noResults/noResults.component';
import { UserMenuComponent } from './header/user-menu/user-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { ReusableSkeletonTableComponent } from './reusableSkeletonTable/reusableSkeletonTable.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    FooterLightComponent,
    LoadingComponent,
    CardComponent,
    NotFoundComponent,
    DownloadComponent,
    NoResultsComponent,
    UserMenuComponent,
    ReusableSkeletonTableComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AppMaterialModule,
    RoutesModule,
    ClipboardModule,
    NotificationModule,
    DirectivesModule,
    MatMenuModule,
    NgxSkeletonLoaderModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    FooterLightComponent,
    LoadingComponent,
    CardComponent,
    NotFoundComponent,
    DownloadComponent,
    NoResultsComponent,
    ReusableSkeletonTableComponent,
  ],
})
export class ComponentsModule {}
