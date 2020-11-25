import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgNavigatorShareService } from 'ng-navigator-share';
import { DialogService } from '../components/dialogs/dialog.service';

@Injectable()
export class SharingService {
  constructor(
    private ngNavigatorShareService: NgNavigatorShareService,
    private dialog: MatDialog,
    private modalService: DialogService,
  ) {}

  public share(text: string, title?: string, url?: string): void {
    if (!this.ngNavigatorShareService.canShare()) {
      console.log('This service/api is not supported in your Browser');
      this.modalService.openShareDialog(window.location.href);
      // this.dialog.open(DialogShareComponent, { id: 'sharingDialog', data: { shareLink: window.location.href } });
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
