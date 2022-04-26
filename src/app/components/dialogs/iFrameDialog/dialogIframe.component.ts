import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DialogData } from '../baseDialogService.abstract';

export interface IframeDialogData {
  IframeUrl: string;
}

@Component({
  selector: 'app-dialog-iframe',
  templateUrl: './dialogIframe.component.html',
  styleUrls: ['./dialogIframe.component.scss'],
})
export class IframeDialogComponent {
  public IframeUrl: SafeResourceUrl;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData<IframeDialogData>, private sanitizer: DomSanitizer) {
    console.log('Construct', data);
    this.IframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.dataIn.IframeUrl);
  }
}
