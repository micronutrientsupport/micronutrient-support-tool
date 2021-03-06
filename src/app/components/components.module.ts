import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppMaterialModule } from '../app-material.module';
import { RoutesModule } from '../routes/routes.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DialogModule } from './dialogs/dialog.module';
import { FooterLightComponent } from './footerLight/footerLight.component';
import { LoadingComponent } from './loading/loading.component';
import { CardComponent } from './card/card.component';
import { NotificationModule } from './notifications/notification.module';
import { NotFoundComponent } from './notFound/notFound.component';
import { DownloadComponent } from '../pages/quickMaps/components/download/download.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    FooterLightComponent,
    LoadingComponent,
    CardComponent,
    NotFoundComponent,
    DownloadComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AppMaterialModule,
    RoutesModule,
    ClipboardModule,
    DialogModule,
    NotificationModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    FooterLightComponent,
    LoadingComponent,
    CardComponent,
    NotFoundComponent,
    DownloadComponent,
  ],
})
export class ComponentsModule {}
