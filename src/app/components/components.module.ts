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

@NgModule({
  declarations: [HeaderComponent, FooterComponent, FooterLightComponent, LoadingComponent],
  imports: [CommonModule, RouterModule, AppMaterialModule, RoutesModule, ClipboardModule, DialogModule],
  exports: [HeaderComponent, FooterComponent, FooterLightComponent, LoadingComponent],
})
export class ComponentsModule { }
