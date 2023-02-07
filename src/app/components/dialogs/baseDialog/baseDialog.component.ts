import { Component, Input } from '@angular/core';
import { DialogData } from '../baseDialogService.abstract';

@Component({
  selector: 'app-base-dialog',
  templateUrl: './baseDialog.component.html',
  styleUrls: ['./baseDialog.component.scss'],
})
export class BaseDialogComponent {
  @Input() data: DialogData;
  @Input() title = '';
  // Dialog that acts as a wrapper for other dialogs.
}
