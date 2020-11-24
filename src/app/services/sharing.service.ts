import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgNavigatorShareService } from 'ng-navigator-share';
import { DialogShareComponent } from '../components/dialog/share/dialogShare.component';

@Injectable()
export class SharingService {
  constructor(private ngNavigatorShareService: NgNavigatorShareService, private dialog: MatDialog) {}

  public share(text: string, title?: string, url?: string): void {
    if (!this.ngNavigatorShareService.canShare()) {
      console.log('This service/api is not supported in your Browser');
      this.dialog.open(DialogShareComponent, { id: 'sharingDialog', data: { shareLink: window.location.href } });
      return;
    }

    this.ngNavigatorShareService
      .share({
        title,
        text,
        url,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
