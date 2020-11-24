import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-dialog-share',
  templateUrl: './dialogShare.component.html',
  styleUrls: ['./dialogShare.component.scss'],
})
export class DialogShareComponent {
  public copyLinkUrl: string;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      shareLink: string;
    },
    private mdDialogRef: MatDialogRef<DialogShareComponent>,
    private clipboard: Clipboard,
  ) {
    this.copyLinkUrl = data.shareLink;
  }

  public copyLink(): void {
    this.clipboard.copy(this.copyLinkUrl);
  }
  public cancel(): void {
    this.close(false);
  }
  public close(value): void {
    this.mdDialogRef.close(value);
  }
  public confirm(): void {
    this.close(true);
  }
  @HostListener('keydown.esc')
  public onEsc(): void {
    this.close(false);
  }
}
