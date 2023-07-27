import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FabMenuComponent } from './fab-menu/fab-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [FabMenuComponent],
  imports: [CommonModule, BrowserAnimationsModule, MatButtonModule, MatIconModule],
  exports: [FabMenuComponent],
})
export class UtilitiesModule {}
