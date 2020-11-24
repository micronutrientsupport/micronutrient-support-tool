import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppMaterialModule } from '../app-material.module';
import { RoutesModule } from '../routes/routes.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ShareModule } from 'ngx-sharebuttons';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DialogShareComponent } from './dialog/share/dialogShare.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, DialogShareComponent],
  imports: [CommonModule, RouterModule, AppMaterialModule, RoutesModule, ClipboardModule, ShareModule],
  exports: [DialogShareComponent, HeaderComponent, FooterComponent],
})
export class ComponentsModule {}
