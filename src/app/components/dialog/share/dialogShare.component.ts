import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-share',
  templateUrl: './dialogShare.component.html',
  styleUrls: ['./dialogShare.component.scss'],
})
export class DialogShareComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      shareLink: string;
    },
    private mdDialogRef: MatDialogRef<DialogShareComponent>,
  ) {}

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
