import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogData } from 'src/app/components/dialogs/baseDialogService.abstract';
import { DialogService } from 'src/app/components/dialogs/dialog.service';

@Component({
  selector: 'app-dialog-step-details',
  templateUrl: './dialogStepDetails.component.html',
  styleUrls: ['./dialogStepDetails.component.scss'],
})
export class DialogStepDetailsComponent {
  constructor(private dialogService: DialogService) {}
  @Input('resetDefaultValues') public resetDefaultValues = false;
  @Input('showUserValues') public showUserValues = false;
  @Output('resetValues') reset: EventEmitter<void> = new EventEmitter();

  public resetValues(): void {
    void this.dialogService.openCEResetDialog().then((data: DialogData) => {
      if (data.dataOut === true) {
        this.reset.next();
      }
    });
  }
}
