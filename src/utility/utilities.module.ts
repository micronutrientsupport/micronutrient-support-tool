import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FabMenuComponent } from './fab-menu/fab-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [FabMenuComponent],
  imports: [CommonModule, BrowserAnimationsModule],
  exports: [FabMenuComponent],
})
export class UtilitiesModule {}
