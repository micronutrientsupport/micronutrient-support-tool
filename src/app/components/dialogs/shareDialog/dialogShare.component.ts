import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { DialogData } from '../baseDialogService.abstract';
import { NotificationsService } from '../../notifications/notification.service';

export interface ShareDialogData {
  shareLink: string;
  title: string;
}

@Component({
  selector: 'app-dialog-share',
  templateUrl: './dialogShare.component.html',
  styleUrls: ['./dialogShare.component.scss'],
})
export class ShareDialogComponent {
  public copyLinkUrl: string;
  public title = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData<ShareDialogData>,
    private clipboard: Clipboard,
    private notificationService: NotificationsService,
  ) {
    console.debug(data.dataIn);
    this.copyLinkUrl = data.dataIn.shareLink;
    this.title = data.dataIn.title;
  }

  public copyLink(): void {
    this.clipboard.copy(this.copyLinkUrl);
    this.notificationService.sendInformative('Link copied: ' + this.copyLinkUrl);
  }
}
