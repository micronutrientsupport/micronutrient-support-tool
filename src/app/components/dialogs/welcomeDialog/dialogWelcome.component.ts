import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { TourService } from 'src/app/services/tour.service';
import { DialogData } from '../baseDialogService.abstract';

export interface WelcomeDialogData {
  IframeUrl: string;
}

@Component({
  selector: 'app-dialog-welcome',
  templateUrl: './dialogWelcome.component.html',
  styleUrls: ['./dialogWelcome.component.scss'],
})
export class WelcomeDialogComponent {
  public IframeUrl: SafeResourceUrl;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData<WelcomeDialogData>, private tourService: TourService) {}

  openQuickMapsTour(evt: Event): void {
    this.data.close();
    this.tourService.startQuickMapsTour(evt);
  }
}
